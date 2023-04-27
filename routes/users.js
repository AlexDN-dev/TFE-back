const express = require('express');
const router = express.Router();

const usersController = require("../controllers/users.controller")

/* Routes for users */
router.get('/', usersController.getAllUsers)
router.post('/', usersController.userConnexion)
router.get('/data', usersController.getData)
router.post('/register', usersController.createUsers)

module.exports = router;