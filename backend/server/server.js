import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';

import { sequelize } from './models';
import userRoutes from './routes/user';
import documentRoutes from './routes/document';

//setting up your port
const PORT = process.env.PORT || 4000;


// Assign app variable to express.
const app = express();

//middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

//synchronizing the database and forcing it to false so we dont lose data
sequelize.sync({ force: true }).then(() => {
  console.log("Sequilize has been re synced with db.")
})

//routes for the user API
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/documents', documentRoutes);

//listening to server connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
