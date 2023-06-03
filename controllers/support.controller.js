const supportModels = require("../models/support.models")
const userModels = require("../models/users.models")

const createTicket = async (req, res, next) => {
    const ticket = req.body.ticket
    const idUser = req.body.idUser
    try {
        await supportModels.createTicket(ticket, idUser)
        res.status(200).json({message: "Le ticket à bien été crée."})
    }catch(err){
        next(err)
    }
}

const getTickets = async (req, res, next) => {
    const id = req.query.id
    try {
        const response = await supportModels.getTickets(id)
        res.status(200).json({ response });
    }catch(err){
        next(err)
    }
}
const getTicket = async (req, res, next) => {
    const id = req.query.id
    try {
        const response = await supportModels.getTicket(id)
        res.status(200).json({ response });
    }catch(err){
        next(err)
    }
}
const getAllTickets = async (req, res, next) => {
    const id = req.query.id
    try {
        const user = await userModels.getUserById(id)
        if(user.permission === 10){
            const response = await supportModels.getAllTickets()
            res.status(200).json({ response });
        }else {
            res.status(401).json({message: "Vous n'êtes pas administrateur !"})
        }
    }catch(err){
        next(err)
    }
}

const sendMessage = async (req, res, next) => {
    const sender = req.body.sender
    const message = req.body.message
    const idTicket = req.body.idTicket
    try {
        await supportModels.sendMessage(sender, message, idTicket)
        res.status(200).json({message: "Message envoyé !"})
    }catch(err){
        next(err)
    }
}

const getMessage = async (req, res, next) => {
    const id = req.query.id
    try {
        const response = await supportModels.getMessage(id)
        res.status(200).json({ response });
    }catch(err){
        next(err)
    }
}
const deleteTicket = async (req, res, next) => {
    const id = req.body.id
    try {
        await supportModels.deleteTicket(id)
        res.status(200).json({message: "Le ticket à bien été supprimé."});
    }catch(err){
        next(err)
    }
}
const reOpenTicket = async (req, res, next) => {
    const id = req.body.id
    try {
        await supportModels.reOpenTicket(id)
        res.status(200).json({message: "Le ticket à bien été réouvert."});
    }catch(err){
        next(err)
    }
}

module.exports = {
    createTicket, getTickets, getTicket, getAllTickets, sendMessage, getMessage, deleteTicket, reOpenTicket
}