const express = require('express');
const router = express.Router();
const multer = require('multer');


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
router.post('/modify', upload.array('images', 15), annonceController.modifyAnnonce);
router.get('/', annonceController.getAnnonceFromSearch)
router.post('/', annonceController.getAnnonceById)
router.post('/getAnnonce', annonceController.getAnnonceFromIdUser)
router.get('/getImages', annonceController.getImages)
router.get('/deleteAnnonce', annonceController.deleteAnnonce)

module.exports = router;