const argon2 = require('argon2');
const jwt = require("jsonwebtoken")
const multer = require('multer');
const ftp = require("basic-ftp");

const usersModels = require("../models/users.models")
const dayjs = require("dayjs");
const fs = require("fs");

async function hashPassword(password) {
    try {
        return await argon2.hash(password);
    } catch (error) {
        console.log(error);
    }
}
async function verifyPassword(hash, password) {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        console.log(error);
    }
}
function isEmail(str) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        const id = req.body.id
        console.log("ID : " + id)
        cb(null, "Image-" + id + '.' + "png");
    }
});

const upload = multer({ storage: storage }).single('file');

const getAllUsers = async (req, res, next) => {
    try {
        const usersList = await usersModels.getAllUsers()
        return res.json(usersList)
    } catch(error) {
        return next(error)
    }
}
const getData = async (req, res, next) => {
    const data = req.body
    const userId = Object.keys(data)[0]
    try {
        const response = await usersModels.getUserById(userId)
        return res.status(200).json({data: response})
    }catch(err){
        return next(err)
    }
}
const userConnexion = async (req, res, next) => {
    const userData = req.body
    const {mail, password} = userData
    try {
        if(isEmail(mail)){
            (usersModels.getOneUserByMail(mail))
                .then(async result => {
                    if(result !== null){
                    if(await verifyPassword(result.password, password)){
                        const payload = {
                            id: result.id,
                            permission: result.permission
                        }
                        const token = await new Promise((resolve, reject) => {
                            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
                                if (err) reject(err)
                                else resolve(token)
                            })
                        })
                        console.log("Token : " + token)
                        return res.status(200).json({message: "Connexion réussite !", token: token})
                    }else {
                        return res.status(401).json({error: "Le mail ou/et le mot de passe est incorrecte."})
                    }
                }else {
                    return res.status(401).json({error: "Le mail n'existe pas !"})
                }
            })

        }else {
            return res.status(401).json({error: "Merci d'entrer un mail valide."})
        }
    } catch(err) {
        return next(err)
    }
}
const createUsers = async (req, res) => {
    const data = req.body
    const date = dayjs(data.age, 'DD-MM-YYYY');
    const now = dayjs();
    const sixteenYearsAgo = now.subtract(16, 'year');
    try {
        if(isEmail(data.mail)){
            if (!date.isAfter(sixteenYearsAgo)){
                (usersModels.hasAlreadyAnAccount(data.mail))
                    .then(async result => {
                        if (result.rows.length === 0) {
                            data.password = await hashPassword(data.password)
                            usersModels.createUser(data)
                            return res.status(200).json({message: "Inscription réussite !"})
                        } else {
                            return res.status(400).json({error: "Un compte avec ce mail existe !"})
                        }
                    })
            }else {
                return res.status(400).json({error: "Il faut au minimum 16 ans pour créer un compte !"})
            }
        }else {
            return res.status(400).json({error: "Veuillez rentrer un mail valide !"})
        }
    } catch (error){
        return res.status(500).json({error: "Une erreur est survenue dans la création de l'utilisateur."})
    }
}
const addPicture = async (req, res, next) => {
    try {
        await upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const id = req.body.id;
            const filename = req.file.filename;

            const client = new ftp.Client();
            client.ftp.verbose = true;

            try {
                await client.access({
                    host: "localhost",
                    user: "ftpuser",
                    password: "password"
                });

                // Vérifier si le fichier existe déjà
                const files = await client.list('/shared/avatar');
                const existingFile = files.find(file => file.name === filename);

                // Si le fichier existe déjà, le supprimer
                if (existingFile) {
                    await client.remove(`/shared/avatar/${existingFile.name}`);
                }

                // Télécharger la nouvelle image
                await client.uploadFrom(req.file.path, `/shared/avatar/${filename}`);

                // Retourner le chemin de l'image téléchargée
                return res.json({ path: `ftp://localhost/shared/avatar/${filename}` });
            } catch (err) {
                return res.status(500).json({ message: err.message });
            } finally {
                client.close();
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
const changePassword = async (req, res, next) => {
    try {
        const userData = req.body
        const {oldPassword, newPassword, repeatPassword, id} = userData
        const response = await usersModels.getUserById(id)
        if(await verifyPassword(response.password, oldPassword)){
            if(newPassword === repeatPassword){
                if(newPassword.length >= 8){
                    usersModels.changePassword(await hashPassword(newPassword), id)
                    return res.status(200).json({message: "Mot de passe modifié, merci de vous reconnecter."})
                }else {
                    return res.status(400).json({error: "Merci d'utiliser un mot de passe avec au moins 8 caractères."})
                }
            }else {
                return res.status(400).json({error: "Les nouveaux mots de passe ne correspondent pas."})
            }
        }else {
            return res.status(400).json({error: "Mot de passe incorrecte."})
        }
    }catch(err){
        return res.status(400).json({error: err})
    }
}
module.exports = {
    getAllUsers,
    createUsers, userConnexion, getData, addPicture,
    changePassword
}