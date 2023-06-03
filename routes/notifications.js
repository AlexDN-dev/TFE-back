const express = require('express');
const router = express.Router();

const notificationsController = require('../controllers/notifications.controller');

router.get('/', notificationsController.getNotification)
router.post('/', notificationsController.sendNotification);
router.get('/getNotification', notificationsController.getOneNotification)
router.post('/delete', notificationsController.deleteNotification)

module.exports = router;