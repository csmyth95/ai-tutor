// Importing modules
import { Sequelize, DataTypes } from 'sequelize';
import { config } from 'dotenv';

import User from './user.js';
import Document from './document.js';

config();
const db_name = process.env.DB_NAME;
const db_port = process.env.DB_PORT;
const db_admin = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;

// Initialise Database connection
const sequelize = new Sequelize(
    `postgres://${db_admin}:${db_password}@postgres:${db_port}/${db_name}`,
    { dialect: "postgres" }
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
db.users = User(sequelize, DataTypes);
db.documents = Document(sequelize, DataTypes);

export default db;
