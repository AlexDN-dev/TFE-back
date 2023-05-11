const fs = require('fs');
const path = require('path');

const annonceModel = require('../models/annonce.models');
const userModel = require('../models/users.models');

const createAnnonce = async (req, res) => {
    try {
        const data = {
            title: req.body.titre,
            marque: req.body.marque,
            model: req.body.modele,
            type: req.body.type,
            km: req.body.km,
            price: req.body.price,
            numOwner: req.body.numOwner,
            status: req.body.state,
            desc: req.body.desc,
            equipment: req.body.equipment,
            color: req.body.color,
            numDoors: req.body.numDoors,
        };
        console.log(data)
        const idUser = req.body.userId;
        const canCreateAnnonce = await annonceModel.canCreateAnnonce(idUser);
        const levelProfile = await userModel.getProfileLevel(idUser);
        let maxAnnonce = 2;
        switch (levelProfile.rows[0].profilLevel) {
            case 0:
                maxAnnonce = 2;
                break;
            case 1:
                maxAnnonce = 4;
        }
        if(canCreateAnnonce.rowCount >= maxAnnonce){
            res.status(403).json({err: "Vous ne pouvez pas créer plus d'annonce."})
        }else {
            await annonceModel.createAnnonce(data, idUser)
            let annonceId = await annonceModel.getAnnonceId(idUser, data.title)
            annonceId = annonceId.rows[0].id;

            const destinationDirectory = path.resolve('annonce', annonceId + "");
            if (!fs.existsSync(destinationDirectory)) {
                fs.mkdirSync(destinationDirectory, { recursive: true });
            }

            // Déplacement des images téléchargées dans le dossier de l'annonce
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const sourcePath = file.path;
                const extension = path.extname(file.originalname);
                const fileName = `${i}${extension}`;
                const destinationPath = path.join(destinationDirectory, fileName);
                fs.renameSync(sourcePath, destinationPath);
            }
        }
        fs.readdir("annonce", (err, files) => {
            if (err) {
                console.error('Erreur lors de la lecture des fichiers du dossier', err);
                return;
            }
            files.forEach((file) => {
                const filePath = path.join("annonce", file);
                const isFile = fs.statSync(filePath).isFile();
                if (isFile) {
                    fs.unlinkSync(filePath);
                }
            });
        })
        return res.status(200).json({message: "L'annonce est créée et en cours de la validation."})
    } catch (err) {
        res.status(400).json({err: "une erreur est survenue."});
    }
};

module.exports = {
    createAnnonce,
};