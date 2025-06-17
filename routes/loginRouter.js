const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');

router.get('/usuario/:id',loginController.getuser);

module.exports = router;