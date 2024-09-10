var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.login);

router.post('/admin_login_process', authController.login_process);

module.exports = router;
