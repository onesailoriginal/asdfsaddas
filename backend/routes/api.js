const express = require('express')
const router = express.Router()
const userContoller = require('../controllers/userContoller')
const auth = require('../middleware/auth')



router.post('/login', auth, userContoller.checkLogin) // --> kész
router.post('/regiter',auth, userContoller.createOneUser) // --> kész
router.post('/play',auth, userContoller.playAGame)
router.put('/save', auth, userContoller.updateOnePlayer) //--> kész 
router.get('/history', auth, userContoller.getOnePlayerData) //--> kész



module.exports = router