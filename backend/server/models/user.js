//user model
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define( "user", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true, //checks for email format
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {timestamps: true}, )  // Adds createdAt and updatedAt fields. Current timestamp of type Date
    return User
 }