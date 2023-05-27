const express = require('express');
const router = express.Router();

const usersController = require("../controllers/users.controller")

/* Routes for users */
router.get('/', usersController.getAllUsers)
router.post('/', usersController.userConnexion)
router.post('/data', usersController.getData)
router.post('/checkAnnonce', usersController.checkAnnonce)
router.post('/register', usersController.createUsers)
router.post('/addPicture', usersController.addPicture)
router.post('/changePassword', usersController.changePassword)
router.post('/changePhoneNumber', usersController.changePhoneNumber)
router.post('/changeCoords', usersController.changeCoords)
router.post('/deleteAccount', usersController.deleteAccount)

module.exports = router;