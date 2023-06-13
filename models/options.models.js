const { Pool } = require("pg")

const pool = new Pool({
    user: process.env.POSGRES_USER,
    host: process.env.POSGRES_HOST,
    database: process.env.POSGRES_DATABASE,
    password: process.env.POSGRES_PASSWORD,
    port: process.env.POSGRES_PORT,
})

const getMarque = async () => {
    try {
        return await pool.query('SELECT marque FROM "MarqueModeles" WHERE modele IS NULL AND status != 0')
    } catch (err) {
        return err
    }
}
const getModele = async (marque) => {
    try {
        return await pool.query('SELECT modele FROM "MarqueModeles" WHERE marque = $1 AND modele IS NOT NULL AND status != 0', [marque])
    }catch(err) {
        return err
    }
}
const deleteMarque = async (marque) => {
    try {
        await pool.query('UPDATE "MarqueModeles" SET status = 0 WHERE marque = $1 AND modele IS NULL', [marque])
    }catch(err){
        return err
    }
}
const deleteModele = async (modele) => {
    try {
        await pool.query('UPDATE "MarqueModeles" SET status = 0 WHERE modele = $1', [modele])
    }catch(err){
        return err
    }
}
const addMarque = async (marque) => {
    try {
        const alreadyIn = await pool.query('SELECT * FROM "MarqueModeles" WHERE marque = $1 AND modele IS NULL AND status = 1', [marque])
        if(alreadyIn.rowCount === 0){
            await pool.query('INSERT INTO "MarqueModeles" (marque, modele) VALUES ($1, $2)', [marque, null])
            return 'Marque ajoutée avec succès.'
        }else {
            return Promise.reject(new Error('La marque existe déjà.'))
        }
    }catch(err){
        return Promise.reject(new Error('Une erreur est survenue lors de l\'ajout de la marque.'))
    }
}
const addModele = async (marque, modele) => {
    try {
        const alreadyIn = await pool.query('SELECT * FROM "MarqueModeles" WHERE marque = $1 AND modele = $2 AND status = 1', [marque, modele])
        if(alreadyIn.rowCount === 0){
            await pool.query('INSERT INTO "MarqueModeles" (marque, modele) VALUES ($1, $2)', [marque, modele])
            return 'Modèle ajoutée avec succès.'
        }else {
            return Promise.reject(new Error('Le modèle existe déjà.'))
        }
    }catch(err){
        return Promise.reject(new Error('Une erreur est survenue lors de l\'ajout de la marque.'))
    }
}

module.exports = {
    getMarque, getModele,deleteMarque, deleteModele, addMarque, addModele
}