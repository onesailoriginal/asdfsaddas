const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const User = sequelize.define('users', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    'username':{
        type: DataTypes.STRING,
        allowNull: false
    },
    'password':{
        type: DataTypes.STRING,
        allowNull: false
    },
    'wins':{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    'draws':{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    'loses':{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    'rock':{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    'paper':{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    'scissors':{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    'last_game':{
        type:DataTypes.DATE,
        allowNull: false
    }
})



module.exports = User