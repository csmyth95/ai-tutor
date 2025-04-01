//importing modules
const {Sequelize, DataTypes} = require('sequelize')
// const dotenv = require('dotenv').config()


const db_name = process.env.DB_NAME;
const db_port = process.env.DB_PORT;
const db_admin = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;


// Initialise Database connection
const sequelize = new Sequelize(
    `postgres://${db_admin}:${db_password}@localhost:${db_port}/${db_name}`,
    {dialect: "postgres"}
)

//checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Connected to Postgres database: ${db_name}`)
}).catch((err) => {
    console.log(err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.users = require('./user') (sequelize, DataTypes)

//exporting the module
module.exports = db
