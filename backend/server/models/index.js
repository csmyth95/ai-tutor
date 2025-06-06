// Importing modules
import { Sequelize, DataTypes } from 'sequelize';
import { config } from 'dotenv';

config();
const db_name = process.env.DB_NAME;

// Initialise Database connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // Optional: disable SQL logging
    }
);

// Checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Connected to Postgres database: ${db_name}`);
}).catch((err) => {
    console.log(err);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Connecting to model
db.users = require('./user')(sequelize, DataTypes);
db.documents = require('./document')(sequelize, DataTypes);

export default db;
