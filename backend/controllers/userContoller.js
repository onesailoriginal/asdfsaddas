const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.checkLogin = async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Felhasználónév és jelszó kötelező', error: 'emptyinputs', success: false });
    }
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Nincs ilyen felhasználó', error: 'wrongusername', success: false });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: 'Nincs ilyen jelszó', error: 'wrongpassword', success: false });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.status(200).json({ token, success: true, message: 'Sikeres bejelentkezés', user });

    } catch (err) {
        res.status(500).json({
            message: 'Hiba történt a lekérdezés közben, hiba: ',
            error: err.message,
            success: false
        });
    }
}

exports.createOneUser = async (req, res) => {
    const { username, password } = req.body;

    // Ellenőrizzük, hogy a felhasználónév és jelszó nem üres
    if (!username || !password || username.trim() === '' || password.trim() === '') {
        return res.status(400).json({ message: 'Felhasználónév és jelszó kötelező', error: 'emptyinputs', success: false });
    }

    try {
        console.log(username, password)
        // Ellenőrizzük, hogy a felhasználónév már létezik-e
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'usedusername', message: 'Hiba, már van ilyen felhasználó.' });
        }

        // Jelszó hashelése
        const hashedPassword = await bcrypt.hash(password, 10);

        // Mai dátum beszerzése
        const today = new Date();

        // Új felhasználó létrehozása
        const newUser = await User.create({
            username,
            password: hashedPassword,
            last_game: today // Dátum hozzáadása
        });
        
        // Sikeres válasz küldése
        return res.status(200).json({
            success: true,
            message: 'Felhasználó létrehozva.',
            user: {
                id: newUser.id,
                username: newUser.username,
                last_game: newUser.last_game // Dátum hozzáadása a válaszban
            }
        });

    } catch (err) {
        // Hibakezelés
        console.error("asd" + err);
        return res.status(500).json({
            message: 'Hiba történt a felhasználó létrehozása közben.',
            error: err.message,
            success: false
        });
    }
};
exports.getOnePlayerData = async(req,res)=>{
    const {username} = req.params;
    try{
        const user = await User.findOne({ where: { username } });
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
    const {username, wins, draws, loses} = req.body;

    try{
        if(!username || !wins|| !draws || !loses){
            return res.status(400).json({
                message: 'Adatok küldése kötelező',
                error: 'emptybody',
                success: false
            })
        }
        
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({
                message: 'Nincs ilyen felhasználó',
                error: 'notuser',
                success: false
            });
        }
        
        user.wins = wins,
        user.draws = draws,
        user.loses = loses,
        await user.save()
        res.json({success: true, message: 'Sikeres update'})
    }catch(err){
        res.status(400).json({
            message: 'Hiba történt a lekérdezés közben, hiba: ',
            error: err.message,
            success: false
        })
        throw err;
    }
}

exports.resetStats = async (req, res) => {
    const {username} = req.body
    try {
        const user = await User.findOne({ where: { username } });
      
        user.wins = 0;
        user.loses = 0;
        user.draws = 0;
        await user.save();

        res.status(200).json({ success: true, message: 'Statisztikák alaphelyzetbe állítva' });
    } catch (err) {
        res.status(500).json({
            message: 'Hiba történt a statisztikák alaphelyzetbe állítása során, hiba:',
            error: err.message,
            success: false
        });
    }
};

