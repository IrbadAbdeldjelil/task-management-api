require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./db.config');
const { User } = require('../models/relation.model');

const createAdmin = async function () {
      
       try {
            await sequelize.authenticate();
            await sequelize.sync({alter: true});
            console.log('connected to DB successfully');
            

            const isExist = await User.findOne({where: {role: 'admin'}});
            if (isExist) {
                console.log('admin account is already exists');
                process.exit(0);
            }

           const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
           await User.create({
            username: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password,
            role: 'admin'
           });

           console.log('admin account created successfully');
           process.exit(0);
           
       } catch (err) {
             console.log('Error : ', err.stack);
            process.exit(1);
       } finally{
        process.exit(0);
       }
}

//create it
createAdmin();