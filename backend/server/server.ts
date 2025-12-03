import express, { json, urlencoded, Request } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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
// Enable CORS with specific origin
// TODO Update production URL when deployment is ready.
app.use(cors<Request>({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

//routes for the user API
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/documents', documentRoutes);

// Error handler middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log(`Connected to Postgres database: ${process.env.POSTGRES_DB}`);

    await db.sequelize.sync({ force: false });
    console.log("Sequelize has been synced with db.");

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

startServer();
