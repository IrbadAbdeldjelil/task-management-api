const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    "id": {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    "googleId": {
       type: DataTypes.STRING,
       unique: true,
       allowNull: true
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
    "avatar": {
      type: DataTypes.STRING,
      allowNull: true
    },
    "password": {
        type: DataTypes.STRING,
        allowNull: true /*true; google user haven't password*/
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
    },
    "verifyEmailToken": {
      type: DataTypes.STRING,
      allowNull: true
    },
    "is_verified": {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

},{
    timestamps: true
});

module.exports = User;