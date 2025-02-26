const express = require('express')
require('dotenv').config()
const dbHandler = require('./config/db')
const apiRoutes = require('./routes/api')
const User = require('./models/User')



const port = process.env.PORT


dbHandler.sync().then(()=>{
    console.log('Adatbázis csatlakozás sikers')
}).catch(error =>{
    console.error('Hiba történt: '+error.message)
})

app.use(express.json())
app.use(express.static('../frontend'))

app.use('/api', apiRoutes)

app.listen(port, () => console.log('Listening on: '+port))