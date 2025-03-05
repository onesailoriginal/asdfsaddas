require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,   // Uncommented to use the database name
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,  // Fixed typo (procces -> process)
        dialect: 'mysql',
        logging: false
    }
);

sequelize.authenticate().then(() => {
    console.log('Connected');
}).catch(error => {
    console.error('Error: ' + error.message); // Fixed formatting
});

module.exports = sequelize;
