require('dotenv').config();
const sequelize = require('./src/config/db.config')
const app = require('./src/app');
const PORT = process.env.PORT || 3000;

const isDev = process.env.NODE_ENV === 'development';

async function start() {
    // connet to db
    try {
        await sequelize.authenticate();
        console.log('connect to DB successfully');
        if (isDev) {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await sequelize.sync({ alter: true });
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('tables synced');
}
        app.listen(PORT, () => console.log(`the server is listening on ${PORT}`));

    } catch (err) {
        console.log('DB connection errors', err);
        process.exit(1);
        
    }
}
// start server
start()