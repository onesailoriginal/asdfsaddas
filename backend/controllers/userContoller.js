const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.checkLogin = async(req, res)=>{
    const {username, password} = req.body
    if(!username || !password){
        return res.status(400).json({message: 'Felhasználónév és jelszó kötelező', error:'emptyinputs', success:false})
    }
    try{
        const user = await User.findOne({where: {username}})
        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if(!user){
            return res.status(400).json({message: 'Nincs ilyen felhasználó', error:'wrongusername', success:false})
        }
        if(!isCorrectPassword){
            return res.status(400).json({message: 'Nincs ilyen jelszó', error:'wrongpassword', success:false})
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '10m'})
        res.status(2000).json({token, success:true, message: 'Sikeres bejelentkezés', user})
    }catch(err){
        res.status(500).json({
            message: 'Hiba történt a lekérdezés közben, hiba: ',
            error: err.message,
            success: false
        })
    }
}

exports.createOneUser = async(req,res)=>{
    const {username, password} = req.body
    if(!username || !password){
        return res.status(400).json({message: 'Felhasználónév és jelszó kötelező', error:'emptyinputs', success:false})
    }
    if(username.trim()==='' || password.trim()=== ''){
        return res.status(400).json({message: 'Felhasználónév és jelszó kötelező', error:'emptyinputs', success:false})

    }
    try{
        const users = await User.findAll()
        for(let i of users){
            if(username == i.username){
                res.status(500).json({success: false, error: 'usedusername', message:'Hiba, már van ilyen felhasználó.'})
            }
            return
        }
        const hashedPassword = await bcrypt.hash(password, 60)
        const newUser = await User.create({
            username, 
            password: hashedPassword
        })
        res.status(201).json({
            success:true,
            message: 'Felhaszáló létrehozva.',
            user: {
                id: newUser.id,
                username: newUser.username
            }
        })
    }catch(err){
        res.status(500).json({
            message: 'Hiba történt a lekérdezés közben, hiba: ',
            error: err.message,
            success: false
        })

    }
}

exports.getOnePlayerData = async(req,res)=>{
    const {id} = req.params;
    try{
        const user = await User.findByPk(id)
        if(!user){
            res.status(500).json({
                message: 'Nincs ilyen felhasználó',
                error: 'notuser',
                success: false
            })
        }
        res.json(user)
    }catch(err){
        res.status(500).json({
            message: 'Hiba történt a lekérdezés közben, hiba: ',
            error: err.message,
            success: false
        })
    }
}

exports.updateOnePlayer = async(req,res)=>{
    const {id} = req.params
    const {wins, draws, loses, rock, paper, scissors} = req.body;

    try{
        const user = await User.findByPk(id)
        if(!user){
            res.status(500).json({
                message: 'Nincs ilyen felhasználó',
                error: 'notuser',
                success: false
            })
        }
        if(!wins|| !draws || !loses || !rock || !paper || !scissors){
            res.status(500).json({
                message: 'Adatok küldése kötelező',
                error: 'emptybody',
                success: false
            })
        }
        user.wins = wins,
        user.draws = draws,
        user.loses = loses,
        user.rock = rock,
        user.paper = paper,
        user.scissors = scissors
        await user.save()
        res.json({success: true, message: 'Sikeres update'})
    }catch(err){
        res.status(500).json({
            message: 'Hiba történt a lekérdezés közben, hiba: ',
            error: err.message,
            success: false
        })
    }
}