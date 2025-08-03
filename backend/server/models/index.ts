// Importing modules
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

import { User, UserAttributes } from './user';
import { Document, DocumentAttributes } from './document';

// Define the database interface
export interface Database {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  users: typeof User;
  documents: typeof Document;
}

// Initialize the database connection and models
const initializeDatabase = (): Database => {
  config();
  
  const db_name = process.env.POSTGRES_DB;
  const db_port = process.env.POSTGRES_PORT;
  const db_user = process.env.POSTGRES_USER;
  const db_password = process.env.POSTGRES_PASSWORD;
  const db_host = process.env.POSTGRES_HOST;
  
  if (!db_name || !db_port || !db_user || !db_password || !db_host) {
    throw new Error('Missing required database configuration');
  }
  
  // Initialize Sequelize with database connection
  const sequelize = new Sequelize(`postgres://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
  
  // Initialize models
  User.initialize(sequelize);
  Document.initialize(sequelize);
  
  // Set up associations
  // User.associate({ Document });
  // Document.associate({ User });
  
  const db = {
    sequelize,
    Sequelize,
    users: User,
    documents: Document,
  };
  
  return db;
};

// Create and export the database instance
let db: Database;

try {
  db = initializeDatabase();
  
  // Test the connection
  db.sequelize.authenticate()
    .then(() => {
      console.log(`Connected to Postgres database: ${process.env.POSTGRES_DB}`);
    })
    .catch((error) => {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    });
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

export { User, UserAttributes } from './user';
export { Document, DocumentAttributes } from './document';

export default db;
