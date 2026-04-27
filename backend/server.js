require('dotenv').config();
const sequelize = require('./src/config/db.config')
const app = require('./src/app');
const PORT = process.env.PORT || 3000;

async function start() {
    // connet to db
    try {
        await sequelize.authenticate();
        console.log('connect to DB successfully');
        await sequelize.sync();
        console.log('table synced');
        app.listen(PORT, () => console.log(`the server is listening on ${PORT}`));

    } catch (err) {
        console.log('DB connection errors', err);
        process.exit(1);
        
    }
}
// start server
start()