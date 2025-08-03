import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';

import config from './config/config.js';
import db from './models/index.js';
import userRoutes from './routes/user.js';
import documentRoutes from './routes/document.js';
import { errorHandler } from './middleware/errorHandler.js';


// Assign app variable to express.
const app = express();

//middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// TODO Remove force True when deploying fully
// Synchronise the database and force it to false so we dont lose data
try {
db.sequelize.sync({ force: false }).then(() => {
  console.log("Sequilize has been re synced with db.")
});
} catch (error) {
  console.error("Failed to sync database: " + error);
}

//routes for the user API
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/documents', documentRoutes);

// Error handler middleware
app.use(errorHandler);

//listening to server connection
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
