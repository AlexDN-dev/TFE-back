const { Pool } = require("pg")

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'ksZZ47',
    port: 5432,
})

const getMarque = async () => {
    try {
        return await pool.query('SELECT marque FROM "MarqueModeles" WHERE modele IS NULL')
    } catch (err) {
        return err
    }
}
const getModele = async (marque) => {
    try {
        return await pool.query('SELECT modele FROM "MarqueModeles" WHERE marque = $1 AND modele IS NOT NULL', [marque])
    }catch(err) {
        return err
    }
}

module.exports = {
    getMarque, getModele
}