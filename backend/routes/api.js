const express = require('express');
const router = express.Router();
const userController = require('../controllers/userContoller');
const gameController = require('../controllers/gameController');
const auth = require('../middleware/auth');

router.post('/login', userController.checkLogin);
router.post('/register', userController.createOneUser);
router.put('/save', auth, userController.updateOnePlayer); 
router.get('/history/:username', auth, userController.getOnePlayerData); // Ezt használja a frontend fetchStats függvénye
router.post('/resetStats', auth, userController.resetStats)
router.post('/play', auth, gameController.playAGame); // Ezt használja a frontend játék indítására


router.post('/checkToken', auth, (req, res) => {
    res.json({ success: true, userId: req.user });
});



module.exports = router;
