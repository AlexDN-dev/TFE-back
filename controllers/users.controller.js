const argon2 = require('argon2');
const jwt = require("jsonwebtoken")

const usersModels = require("../models/users.models")
const dayjs = require("dayjs");

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
const getAllUsers = async (req, res, next) => {
    try {
        const usersList = await usersModels.getAllUsers()
        return res.json(usersList)
    } catch(error) {
        return next(error)
    }
}
const getData = async (req, res, next) => {
    const userId = req.body
    try {
    }catch(err){
        return next(err)
    }
}
const userConnexion = async (req, res, next) => {
    const userData = req.body
    const {mail, password} = userData
    let test =null
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

module.exports = {
    getAllUsers,
    createUsers, userConnexion, getData
}