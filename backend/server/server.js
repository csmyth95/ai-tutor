const express = require('express');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');

const models = require('./models');
const userRoutes = require('./routes/user');
const documentRoutes = require('./routes/document');


// TODO 
// 1. Use docker compose to setup the Postgres & Server containers
// 2. Test using Postman locally

//setting up your port
const PORT = process.env.PORT || 4000;

// Assign app variable to express.
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//synchronizing the database and forcing it to false so we dont lose data
models.sequelize.sync({ force: true }).then(() => {
  console.log("Sequilize has been re synced with db.")
})

//routes for the user API
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/documents', documentRoutes);

//listening to server connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
