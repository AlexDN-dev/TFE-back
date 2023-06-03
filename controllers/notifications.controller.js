
const notificationsModel = require("../models/notifications.models")
const WebSocketManager = require('../websocket');

const getNotification = async (req, res, next) => {
    const userId = req.query.userId
    try {
        const response = await notificationsModel.getNotification(userId)
        res.status(200).json({response})
    }catch(err){
        res.status(400).json({error: 'erreur dans la récupération des notifications.'})
    }
}

const sendNotification = async (req, res, next) => {
    const userId = req.body.receiver
    const texte = req.body.texte
    const titre = req.body.titre
    try {
        await notificationsModel.sendNotification(userId,titre,texte)
        await WebSocketManager.sendNotificationToUser(userId, "Vous avez reçu une notification.");
        res.status(200).json({message: 'La notification a correctement été envoyé.'})
    }catch(err){
        next(err)
    }
}

const getOneNotification = async (req, res, next) => {
    const id = req.query.id
    try {
        await notificationsModel.setToReaded(id)
        const response = await notificationsModel.getOneNotification(id)
        res.status(200).json({response})
    }catch(err){
        res.status(400).json({message: "une erreur est survenue."})
    }
}

const deleteNotification = async (req, res, next) => {
    const id = req.body.notificationId
    try {
        await notificationsModel.deleteNotification(id)
        res.status(200).json({message: "La notification a bien été supprimé."})
    }catch(err){
        res.status(400).json({message: "Une erreur est survenue."})
    }
}

module.exports = {
    sendNotification, getNotification, getOneNotification, deleteNotification
}