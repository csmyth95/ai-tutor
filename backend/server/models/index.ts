import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin, 
    HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManySetAssociationsMixin, HasManyRemoveAssociationMixin, 
    HasManyRemoveAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, 
    HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, ForeignKey , Sequelize } from 'sequelize';
import config from '../config/config.js';

// Define the database interface
export interface Database {
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    users: typeof User;
    documents: typeof Document;
}

// Initialize Sequelize with database connection
const sequelize = new Sequelize(`postgres://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`, {
    dialect: 'postgres',
    logging: config.nodeEnv === 'DEV' ? console.log : false,
});

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Document associations
  declare getDocuments: HasManyGetAssociationsMixin<Document>;
  declare addDocument: HasManyAddAssociationMixin<Document, number>;
  declare addDocuments: HasManyAddAssociationsMixin<Document, number>;
  declare setDocuments: HasManySetAssociationsMixin<Document, number>;
  declare removeDocument: HasManyRemoveAssociationMixin<Document, number>;
  declare removeDocuments: HasManyRemoveAssociationsMixin<Document, number>;
  declare hasDocument: HasManyHasAssociationMixin<Document, number>;
  declare hasDocuments: HasManyHasAssociationsMixin<Document, number>;
  declare countDocuments: HasManyCountAssociationsMixin;
  declare createDocument: HasManyCreateAssociationMixin<Document, 'ownerId'>;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
      args: [10, 255],
      msg: 'Password must be between 10 and 255 characters',
      },
    },
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
},
{
  sequelize: sequelize,
  modelName: 'user',
  timestamps: true,
});

class Document extends Model<InferAttributes<Document>, InferCreationAttributes<Document>> {
  declare id: number;
  declare ownerId: ForeignKey<User['id']>;
  declare s3Path: string;
  declare summary: string;
  declare title: string;
  declare tags: string[] | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    s3Path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: 'document',
    timestamps: true,
  }
);

Document.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

// Define Associations
const UserDocuments = User.hasMany(Document, {
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'documents',
});


const db = {
  sequelize,
  Sequelize,
  users: User,
  documents: Document,
  userDocuments: UserDocuments,
};
try {
    db.sequelize.authenticate()
      .then(() => {
        console.log(`Connected to Postgres database: ${process.env.POSTGRES_DB}`);
      })
      .catch((error) => {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
      });
    
    db.sequelize.sync();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

export { db };
export default db;
