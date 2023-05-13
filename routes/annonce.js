const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const annonceController = require('../controllers/annonce.controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'annonce/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/create', upload.array('images', 15), annonceController.createAnnonce);
router.get('/', annonceController.getAnnonceFromSearch)

module.exports = router;