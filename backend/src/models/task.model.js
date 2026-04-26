const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Task = sequelize.define('Task', {
    "id": {
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true
    },
    "title": {
        type: DataTypes.STRING,
        allowNull: false
    },
    "description": {
        type: DataTypes.TEXT,
        allowNull: true
    },
    "status": {
        type: DataTypes.ENUM('in-progress', 'done'),
        defaultValue: "in-progress"
    },
    "userId": {
        type: DataTypes.UUID,
        allowNull:false
    }
},
    {
        timestamps: true
    });

module.exports = Task;