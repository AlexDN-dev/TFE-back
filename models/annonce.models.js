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

const modifyAnnonce = async (data, idAnnonce) => {
    try {
        pool.query('UPDATE annonce SET title=$1, marque=$2, model=$3, type=$4, km=$5, price=$6, "numOwner"=$7,status=$8, "desc"=$9, equipment=$10, color=$11, "numDoors"=$12, annee=$13, puissance=$14, autonomie=$15 WHERE id=$16', [data.title, data.marque, data.model, data.type, data.km, data.price, data.numOwner, data.status, data.desc, data.equipment, data.color, data.numDoors, data.annee, data.puissance, data.autonomie, idAnnonce])
    }catch(err) {
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

const getAnnonceById = async (id) => {
    try {
        return await pool.query('SELECT * FROM annonce WHERE id = $1', [id])
    }catch(err) {
        return err
    }
}

const getAnnonceFromIdUser = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM annonce WHERE id_owner = $1 ORDER BY id', [id]);
        if (result.rows.length > 0) {
            return result.rows;
        } else {
            throw new Error('Aucune annonce trouvée pour cet utilisateur');
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des annonces :', err);
        throw err;
    }
}

module.exports = {
    createAnnonce, getAnnonceId, canCreateAnnonce, getAnnonceFromSearch, getAnnonceById, getAnnonceFromIdUser, modifyAnnonce
}