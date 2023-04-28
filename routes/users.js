const express = require('express');
const multer  = require('multer');
const router = express.Router();

const usersController = require("../controllers/users.controller")

/* Routes for users */
router.get('/', usersController.getAllUsers)
router.post('/', usersController.userConnexion)
router.post('/data', usersController.getData)
router.post('/register', usersController.createUsers)
router.post('/addPicture', usersController.addPicture)
router.post('/changePassword', usersController.changePassword)

module.exports = router;