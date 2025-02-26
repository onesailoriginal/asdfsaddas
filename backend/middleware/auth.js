const jwt = require('jsonwebtoken')


const auth = (req, res, next) =>{
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(401).json({success: false, message: 'Nincs token'})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.userId
        next()
    }catch(err){
        if(err.name == 'TokenExpiredError'){
            return res.status(401).json({success: false, message: 'Lejárt a token'})
        }
        return res.status(401).json({success: false, message: 'A token nem valid'})
    }
}

module.exports = auth