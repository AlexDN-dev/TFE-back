const { Pool } = require("pg");

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'ksZZ47',
    port: 5432,
});

const createTicket = async (ticket, idUser) => {
    try {
        pool.query('INSERT INTO ticket (title, creator, description, id_user) VALUES ($1, $2, $3, $4)', [ticket.title, ticket.creator, ticket.description, idUser])
    }catch(err){
        return err
    }
}

const getTickets = async (id) => {
    try {
        return await pool.query('SELECT * FROM ticket WHERE id_user = $1', [id])
    }catch(err){
        return err
    }
}
const getTicket = async (id) => {
    try {
        return await pool.query('SELECT * FROM ticket WHERE id = $1', [id])
    }catch(err){
        return err
    }
}

const getAllTickets = async () => {
    try {
        return await pool.query('SELECT * FROM ticket')
    }catch(err){
        return err
    }
}

const sendMessage = async (sender, message, idTicket) => {
    try {
        const currentDateTime = new Date();
        const gmtPlus2DateTime = new Date(currentDateTime.getTime() + (2 * 60 * 60 * 1000));
        await pool.query('INSERT INTO message (sender, message, date, id_ticket) VALUES ($1, $2, $3, $4)', [sender, message, gmtPlus2DateTime, idTicket]);
        console.log("test")
    }catch(err){
        console.log(err)
        return err
    }
}

const getMessage = async (id) => {
    try {
        return await pool.query('SELECT * FROM message WHERE id_ticket = $1 ORDER BY date', [id])
    }catch(err){
        return err
    }
}
const deleteTicket = async (id) => {
    try {
        await pool.query('UPDATE ticket SET "isClose" = 1 WHERE id = $1', [id])
    }catch(err){
        return err
    }
}
const reOpenTicket = async (id) => {
    try {
        await pool.query('UPDATE ticket SET "isClose" = 0 WHERE id = $1', [id])
    }catch(err){
        return err
    }
}



module.exports = {
    createTicket, getTickets, getTicket, getAllTickets, sendMessage, getMessage, deleteTicket, reOpenTicket
};