const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    "id": {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    "username": {
        type: DataTypes.STRING,
        allowNull: false
    },
    "email": {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    "password": {
        type: DataTypes.STRING,
        allowNull: false
    },
    "role": {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: "user"
    },
    "lastLogin": {
        type: DataTypes.DATE,
        allowNull: true
    },
    "lastActive": {
        type: DataTypes.DATE,
        allowNull: true
    }

},{
    timestamps: true
});

module.exports = User;