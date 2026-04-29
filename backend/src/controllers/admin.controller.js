const createError = require('http-errors');
const { User, Task } = require('../models/relation.model');
const { sendResponse } = require('../helpers/responses');
const sequelize = require('../config/db.config')

// get all users
module.exports.getUsers = async(req, res, next) => {
    
    const users = await User.findAll({
        attributes:["id", "username", "email", "createdAt","lastActive", "lastLogin",
           [sequelize.fn('COUNT', sequelize.col('Tasks.id')), 'Tasks'],
           [sequelize.literal(`(
                SELECT COUNT(*) FROM "Tasks"
                WHERE "Tasks"."userId" = "User"."id"
                AND "Tasks"."status" = 'done'
               )`), 'done'],
           [sequelize.literal(`(
                   SELECT COUNT(*) FROM "Tasks"
                   WHERE "Tasks"."userId" = "User"."id"
                   AND "Tasks"."status" = 'in-progress'
                   )`), 'in-progress']
        ],       
        include:{
            model: Task,
            attributes: [],
        },
        group: ['User.id']
        
    });
    sendResponse(res, true, 200, 'all users', users, null);
}

// get user by ID
module.exports.getUser = async(req, res, next) => {

    const {id} = req.uuid;
    const user = await User.findOne({
        where:{id},
        attributes:[
            "username", "email", "lastActive", "lastLogin",
            [sequelize.literal(`(
                   SELECT COUNT(*) FROM "Tasks"
                   WHERE "Tasks"."userId" = "User"."id" 
                )`), 'Tasks'],
            [sequelize.literal(`(
                     SELECT COUNT(*) FROM "Tasks"
                     WHERE "Tasks"."userId" = "User"."id"
                     AND "Tasks"."status" = 'done'
                    )`), 'done'],
            [sequelize.literal(`(
                        SELECT COUNT(*) FROM "Tasks"
                        WHERE "Tasks"."userId" = "User"."id"
                        AND "Tasks"."status" = 'in-progress'
                        )`), 'in-progress']
                    ],
            include:{
                model: Task,
                attributes:[]
            }            
            });
        if(!user) throw createError(404, 'user not exist');
    sendResponse(res, true, 200, 'user is found successfully', [user], null)
}


// delete user by ID
module.exports.deleteUser = async(req, res, next) => {

    const {id} = req.uuid;
    const user = await User.findByPk(id);

    if(!user) throw createError(404, 'user not exist');
    const deleted = await User.destroy({where:{id}});
    if(!deleted) throw createError(500, 'something went wrong, cannot delete');
    sendResponse(res, true, 200, 'user deleted successfully', null, null);
}

// admin stats
module.exports.getStats = async (req, res, next) => {
      
    const users = await User.count();
    const tasks = await Task.count();
    const completedtasks = await Task.count({where: {"status": "done"}});
    const uncompletedTasks = await Task.count({where: {"status": "in-progress"}});
    
    sendResponse(res, true, 200, 'stats', [{users, tasks, completedtasks, uncompletedTasks}], null);
}