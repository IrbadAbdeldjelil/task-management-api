const User = require('../models/user.model');
const Task = require('../models/task.model');

User.hasMany(Task, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Task.belongsTo(User, {
    foreignKey: 'userId'
});

module.exports = { User, Task };