const optionsModels = require("../models/options.models")
const usersModels = require("../models/users.models")
const annonceModels = require("../models/annonce.models")
const supportModels = require("../models/support.models")

const getMarque = async (req, res, next) => {
    try {
        const response = await optionsModels.getMarque()
        res.json(response.rows);
    } catch (err) {
        return next(err)
    }
}
const getModele = async (req, res, next) => {
    try {
        const marque = req.query.marque;
        const response = await optionsModels.getModele(marque)
        const modeles = response.rows.map((row) => row.modele);
        res.json(modeles);
    } catch (err) {
        return next(err)
    }
}
const deleteMarqueOrModele = async (req, res, next) => {
    try {
        const marque = req.body.deleteMarque
        const modele = req.body.deleteModele
        if(modele === null || modele === ""){
            await optionsModels.deleteMarque(marque)
            res.status(200).json({message: "La marque est bien supprimé"})
        }else {
            await optionsModels.deleteModele(modele)
            res.status(200).json({message: "Le Modèle est bien supprimé"})
        }
    }catch(err) {
        next(err)
    }
}
const addMarque = async (req, res, next) => {
    try {
        const marque = req.body.addMarque
        const message = await optionsModels.addMarque(marque)
        res.status(200).json({message: message})
    }catch(err){
        next(err)
    }
}
const addModele = async (req, res, next) => {
    try {
        const marque = req.body.marque
        const modele = req.body.modele
        const message = await optionsModels.addModele(marque, modele)
        res.status(200).json({message: message})
    }catch(err){
        next(err)
    }
}
const getStats = async (req, res, next) => {
    try {
        const user = await usersModels.getAllUsers()
        const annonce = await annonceModels.getAllAnnonce()
        const support = await supportModels.getAllOpenTickets()
        res.status(200).json({user: user.rowCount, annonce: annonce.rowCount, support: support.rowCount})
    }catch(err){
        next(err)
    }
}

module.exports = {
    getMarque, getModele, deleteMarqueOrModele, addMarque, addModele, getStats
}