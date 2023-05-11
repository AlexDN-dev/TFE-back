const express = require('express');
const router = express.Router();

const optionsController = require('../controllers/options.controller');

router.get('/getMarque', optionsController.getMarque);
router.get('/getModele', optionsController.getModele)

module.exports = router;