const express = require('express');
const router =  express.Router();

const playerController = require('../controllers/playerController');

router.get('/answer/:number/:id',playerController.answer);
router.get('/checkSent',playerController.checkSent);
router.post('/checkAnswer', playerController.checkAnswer);
router.post('/buzzer',playerController.buzzer);
router.get('/results', playerController.results);
router.get('/adminLogin',playerController.adminPage);
router.post('/adminLogin',playerController.adminLogin);
router.post('/addQue',playerController.addQuestion);
router.get('/admin', playerController.adminHome);
router.post('/home',playerController.home);
router.get('/logout',playerController.logout);
router.get('/game',playerController.game);
router.get('/check/:number', playerController.check);
router.get('/', playerController.index);

module.exports = router;