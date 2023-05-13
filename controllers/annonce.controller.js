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
            annee: req.body.annee,
            puissance: req.body.puissance,
            autonomie: req.body.autonomie
        };
        const idUser = req.body.userId;
        const canCreateAnnonce = await annonceModel.canCreateAnnonce(idUser);
        const levelProfile = await userModel.getProfileLevel(idUser);
        let maxAnnonce = 2;
        switch (levelProfile.rows[0].profilLevel) {
            case 0:
                maxAnnonce = 50; //à remplacer par 2 lors de la mise en prod
                break;
            case 1:
                maxAnnonce = 50; //à remplacer par 4 lors de la mise en prod
                break;
        }
        if(canCreateAnnonce.rowCount >= maxAnnonce){
            res.status(403).json({err: "Vous ne pouvez pas créer plus d'annonce."})
        }else {
            await annonceModel.createAnnonce(data, idUser)
            let annonceId = await annonceModel.getAnnonceId(idUser, data.title, data.price, data.km)
            annonceId = annonceId.rows[0].id;

            const destinationDirectory = path.resolve('annonce', annonceId + "");
            if (!fs.existsSync(destinationDirectory)) {
                fs.mkdirSync(destinationDirectory, { recursive: true });
            }

            // Déplacement des images téléchargées dans le dossier de l'annonce
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const sourcePath = file.path;
                const extension = ".jpg"
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

const getAnnonceFromSearch = async (req, res, next) => {
    const queryParams = req.query;
    let request = "SELECT * FROM annonce"
    let value = []
    let compteur = 1
    console.log(queryParams)
    if("marque" in queryParams){
        if(compteur === 1){
            request += " WHERE marque = $" + compteur
        }else {
            request += " AND marque = $" + compteur
        }
        value.push(queryParams.marque)
        compteur++
    }
    if("modele" in queryParams){
        if(compteur === 1){
            request += " WHERE model = $" + compteur
        }else {
            request += " AND model = $" + compteur
        }
        value.push(queryParams.modele)
        compteur++
    }
    if("prix" in queryParams){
        if(compteur === 1){
            request += " WHERE price <= $" + compteur
        }else {
            request += " AND price <= $" + compteur
        }
        value.push(queryParams.prix)
        compteur++
    }
    if("kmMax" in queryParams){
        if(compteur === 1){
            request += " WHERE km <= $" + compteur
        }else {
            request += " AND km <= $" + compteur
        }
        value.push(queryParams.kmMax)
        compteur++
    }
    if("autonomieMin" in queryParams){
        if(compteur === 1){
            request += " WHERE autonomie >= $" + compteur
        }else {
            request += " AND autonomie >= $" + compteur
        }
        value.push(queryParams.autonomieMin)
        compteur++
    }
    if("anneeProd" in queryParams){
        if(compteur === 1){
            request += " WHERE annee >= $" + compteur
        }else {
            request += " AND annee >= $" + compteur
        }
        value.push(queryParams.anneeProd)
        compteur++
    }
    if("numOwnerMax" in queryParams){
        if(compteur === 1){
            request += " WHERE numOwner <= $" + compteur
        }else {
            request += " AND numOwner <= $" + compteur
        }
        value.push(queryParams.numOwnerMax)
        compteur++
    }
    if("numDoorsMax" in queryParams){
        if(compteur === 1){
            request += " WHERE numDoors <= $" + compteur
        }else {
            request += " AND numDoors <= $" + compteur
        }
        value.push(queryParams.numDoorsMax)
        compteur++
    }
    if("type" in queryParams){
        if(compteur === 1){
            request += " WHERE type = $" + compteur
        }else {
            request += " AND type = $" + compteur
        }
        value.push(queryParams.type)
        compteur++
    }
    try {
        const response = await annonceModel.getAnnonceFromSearch(request, value)
        return res.status(200).json({response})
    }catch(err){
        next(err)
    }
}

module.exports = {
    createAnnonce,getAnnonceFromSearch
};