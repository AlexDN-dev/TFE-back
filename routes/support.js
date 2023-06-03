const express = require('express');
const router = express.Router();

const supportController = require('../controllers/support.controller');

router.post('/', supportController.createTicket)
router.get('/', supportController.getTickets)
router.get('/getTicket', supportController.getTicket)
router.get('/admin/getAllTickets', supportController.getAllTickets)
router.post('/sendMessage', supportController.sendMessage)
router.get('/getMessage', supportController.getMessage)
router.post('/delete', supportController.deleteTicket)
router.post('/reopen', supportController.reOpenTicket)

module.exports = router;