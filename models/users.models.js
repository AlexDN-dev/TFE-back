const { Pool } = require("pg")

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'ksZZ47',
    port: 5432,
})

const getAllUsers = () => {
    return pool.query('SELECT * from users')
}
const getUserById = async (id) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0];
    } catch (err) {
        throw new Error(err);
    }
}
const getOneUserByMail = async (mail) => {
    try {
        const res = await pool.query('SELECT * from users WHERE mail = $1', [mail]);
        const user = res.rows[0];
        if (!user) {
            return null;
        }
        const formattedUser = {
            id: user.id,
            mail: user.mail,
            password: user.password,
            permission: user.permission
        };
        return formattedUser;
    } catch (err) {
        throw new Error(err);
    }
};
const createUser = (userData) => {
     const { firstName, lastName, mail, password, age, city, postalCode, phoneNumber, picture, profilLevel, permission } = userData;
     const values = [firstName, lastName, mail, password, age, city, postalCode, phoneNumber, picture, profilLevel, permission];
     pool.query('INSERT INTO users ("firstName", "lastName", mail, password, age, city, "postalCode", "phoneNumber", picture, "profilLevel", permission) VALUES ($1,$2,$3,$4,$5,$6,$7, $8, $9, $10, $11)', values)
}
const hasAlreadyAnAccount = (mail) => {
    const value = [mail]
    return pool.query('SELECT id from users WHERE mail = $1', value)
}
const changePassword = (password, id) => {
    const values = [password, id]
    console.log(values)
    pool.query('UPDATE users SET password = $1 WHERE id = $2', values)
}

module.exports = {
    getAllUsers, getOneUserByMail, createUser, hasAlreadyAnAccount, getUserById, changePassword
}