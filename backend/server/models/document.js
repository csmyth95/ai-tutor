module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define("document", {
        id: {
            type: DataTypes.STRING, 
            primaryKey: true 
        },
        userId: {
            type: DataTypes.STRING, 
            allowNull: false 
        },
        s3Path: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        summary: { 
            type: DataTypes.TEXT,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings for tags
            allowNull: true,
        },
    }, {timestamps: true}, )  // Adds createdAt and updatedAt fields. Default is current timestamp of type Date.
    return Document;
};
