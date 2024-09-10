var express = require('express');
var router = express.Router();

const homeController = require('../controllers/homeController');
const profileController = require('../controllers/profileController');
const workController = require('../controllers/workController');
const contactController = require('../controllers/contactController')

// 루트 경로
router.get('/', homeController.getHome);

// 프로필 경로
router.get('/profile', profileController.getAllProfiles);

// 작업 경로
router.get('/work', workController.getAllWorks);

// 리뷰 경로
// router.get('/review', );

// 연락처 경로
router.get('/contact', contactController.getContact);
router.post('/contact/send-email', contactController.sendEmail);

module.exports = router;