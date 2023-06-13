const express = require('express');
const router = express.Router();

const usersController = require("../controllers/users.controller");
const fs = require("fs");
const path = require("path");
function generateUniqueFileName() {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 7);
    return `${timestamp}-${randomString}.png`;
}

/* Routes for users */
router.get('/', usersController.getAllUsers);
router.post('/', usersController.userConnexion);
router.post('/data', usersController.getData);
router.post('/checkAnnonce', usersController.checkAnnonce);
router.post('/register', usersController.createUsers);
router.post('/addPicture', usersController.addPicture);
router.get('/getPicture', usersController.getPicture);
router.post('/changePassword', usersController.changePassword);
router.post('/changePhoneNumber', usersController.changePhoneNumber);
router.post('/changeCoords', usersController.changeCoords);
router.post('/deleteAccount', usersController.deleteAccount);

/* LIKE SYSTEM */
router.get('/getScore', usersController.getScore)
router.post('/positiveVote', usersController.positiveVote)
router.post('/negativeVote', usersController.negativeVote)

/*Admin route*/
router.post('/setAdmin', usersController.setAdmin)
router.post('/setUser', usersController.setUser)
router.post('/banUser', usersController.banUser)
router.post('/unbanUser', usersController.unbanUser)

module.exports = router;
