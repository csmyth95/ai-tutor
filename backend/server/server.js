import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';

import db from './models/index.js';
import userRoutes from './routes/user.js';
import documentRoutes from './routes/document.js';


//setting up your port
const PORT = process.env.PORT || 4000;

// Assign app variable to express.
const app = express();

//middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// TODO Remove force True when deploying fully
// Synchronisethe database and force it to false so we dont lose data
db.sequelize.sync({ force: false }).then(() => {
  console.log("Sequilize has been re synced with db.")
});

//routes for the user API
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/documents', documentRoutes);

//listening to server connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
