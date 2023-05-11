const optionsModels = require("../models/options.models")

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
        const response = await optionsModels.getModele(marque) //méthode qui va récupérer en bdd
        const modeles = response.rows.map((row) => row.modele);
        res.json(modeles);
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    getMarque, getModele
}