const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const profileController = require('../controllers/profileController');
const workController = require('../controllers/workController');

router.get('/home', adminController.home);

// 프로필
router.get('/profile', adminController.profile);
router.post('/profile/create', profileController.createProfile);
router.post('/profile/delete/:profileId', profileController.deleteProfile);
router.post('/profile/update/:profileId', profileController.updateProfile);

// 작업
router.get('/work', adminController.work);
router.post('/work/create', workController.createWork);
router.post('/work/update/', workController.updateWork);
router.post('/work/delete/:workId', workController.deleteWork);

module.exports = router;
