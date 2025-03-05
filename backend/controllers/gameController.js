const User = require('../models/User')


exports.playAGame = async(req,res)=>{
    const {selectedItem} = req.body
    if(!selectedItem){
        return res.status(400).json({message:'Item kiválasztása követelző', error:'emptyitem', succes: false})
    }
    try{    
        const avaliableItems = ['rock', 'paper', 'scissors']
        const botItem = getRandomElement(avaliableItems)
        
        if(botItem === selectedItem){
            return res.status(200).json({message:'Döntetlen', succes: true, playerWin: false, botWin: false, draw: true, botItem})
        } else if(
            (botItem === 'rock' && selectedItem === 'scissors') ||
            (botItem === 'paper' && selectedItem === 'rock') ||
            (botItem === 'scissors' && selectedItem === 'paper')
        ){
            return res.status(200).json({message:'Bot nyert', succes: true, playerWin: false, botWin: true, draw: false, botItem})
        } else {
            return res.status(200).json({message:'Te nyertél!', succes: true, playerWin: true, botWin: false, draw: false, botItem})
        }

    }catch(err){
        res.status(400).json({
            message:'Hiba történt a játék során, hiba:',
            error: err.message,
            success: false
        })
    }
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

