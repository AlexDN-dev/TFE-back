const { Pool } = require("pg")

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'ksZZ47',
    port: 5432,
})

const createAnnonce = async (data, idUser) => {
    try {
        pool.query('INSERT INTO annonce (title, marque, model, type, km, price, "numOwner", status, "desc", equipment, color, "numDoors", annee, id_owner, puissance, autonomie) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [data.title, data.marque, data.model, data.type, data.km, data.price, data.numOwner, data.status, data.desc, data.equipment, data.color, data.numDoors, data.annee ,idUser, data.puissance, data.autonomie])
    } catch (err) {
        return err
    }
}

const getAnnonceId = async (idUser, title, price, km) => {
    try {
        return await pool.query('SELECT id FROM annonce WHERE id_owner = $1 AND title = $2 AND price = $3 AND km = $4', [idUser, title, price, km])
    }catch (err) {
        return err
    }
}
const canCreateAnnonce = async (idUser) => {
    try {
        return await pool.query('SELECT id FROM annonce WHERE id_owner = $1', [idUser])
    }catch(err){
        return err
    }
}

const getAnnonceFromSearch = async (request, value) => {
    try {
        return await pool.query(request, value)
    }catch(err) {
        return err
    }
}

module.exports = {
    createAnnonce, getAnnonceId, canCreateAnnonce, getAnnonceFromSearch
}