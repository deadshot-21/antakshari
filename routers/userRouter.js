const express = require('express');
const router =  express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.home);
// router.post('/home',userController.home);

module.exports = router;