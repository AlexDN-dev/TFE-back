const { Pool } = require("pg");

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'ksZZ47',
    port: 5432,
});

const getNotification = async (userId) => {
    try {
        return pool.query('SELECT * FROM notification WHERE receiver = $1 AND delete = 0 ORDER BY date DESC', [userId])
    }catch(err){
        return err
    }
}

const sendNotification = async (userId, titre, texte) => {
    try {
        const currentDateTime = new Date();
        const gmtPlus2DateTime = new Date(currentDateTime.getTime() + (2 * 60 * 60 * 1000));
        await pool.query('INSERT INTO notification (title, message, receiver, date) VALUES ($1, $2, $3, $4)', [titre, texte, userId, gmtPlus2DateTime]);
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getOneNotification = async (id) => {
    try {
        return await pool.query('SELECT * FROM notification WHERE id = $1', [id])
    }catch(err){
        return err
    }
}

const setToReaded = async (id) => {
    try {
        await pool.query('UPDATE notification SET readed = 1 WHERE id = $1', [id])
    }catch (err) {
        return err
    }
}

const deleteNotification = async (id) => {
    try {
        await pool.query('UPDATE notification SET "delete" = 1 WHERE id = $1', [id])
    }catch(err) {
        return err
    }
}

module.exports = {
    sendNotification, getNotification, setToReaded, getOneNotification, deleteNotification
};