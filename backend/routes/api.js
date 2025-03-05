const express = require('express');
const router = express.Router();
const userController = require('../controllers/userContoller');
const gameController = require('../controllers/gameController');

router.post('/login', userController.checkLogin);
router.post('/register', userController.createOneUser);
router.put('/save', userController.updateOnePlayer); 
router.get('/history/:username', userController.getOnePlayerData); // Ezt használja a frontend fetchStats függvénye
router.post('/resetStats', userController.resetStats)
router.post('/play', gameController.playAGame); // Ezt használja a frontend játék indítására


module.exports = router;
