const express = require('express');
const router = express.Router();

const optionsController = require('../controllers/options.controller');

router.get('/getMarque', optionsController.getMarque);
router.get('/getModele', optionsController.getModele)
router.get('/stats', optionsController.getStats)
router.post('/delete', optionsController.deleteMarqueOrModele)
router.post('/addMarque', optionsController.addMarque)
router.post('/addModele', optionsController.addModele)

module.exports = router;