// Importing modules
import { Sequelize, DataTypes } from 'sequelize';
import { config } from 'dotenv';

import User from './user.js';
import Document from './document.js';

const db = {}
try {
    config();
    const db_name = process.env.POSTGRES_DB;
    const db_port = process.env.POSTGRES_PORT;
    const db_user = process.env.POSTGRES_USER;
    const db_password = process.env.POSTGRES_PASSWORD;
    const db_host = process.env.POSTGRES_HOST;
    
    // Initialise Database connection
    const sequelize = new Sequelize(`postgres://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`,{
        dialect: "postgres"
    });
    
    // Checking if connection is done
    sequelize.authenticate().then(() => {
        console.log(`Connected to Postgres database: ${db_name}`);
    }).catch((err) => {
        console.log(err);
    });   

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    // Connecting to model
    db.users = User(sequelize, DataTypes);
    db.documents = Document(sequelize, DataTypes);
} catch (error) {
    console.log("Failed to connect to PostgresDB: ${error}")
    process.exit(1);
}

export default db;
