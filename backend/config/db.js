require('dotenv').config()
const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(
    procces.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: proccess.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
)

sequelize.authenticate().then(()=>{
    console.log('connected')
}).catch(error =>{
    console.error('error:'+error.message)
})

module.exports = sequelize