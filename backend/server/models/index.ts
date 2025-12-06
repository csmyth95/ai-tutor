import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManySetAssociationsMixin, HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
    HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, ForeignKey, HasOneGetAssociationMixin,
    HasOneSetAssociationMixin, HasOneCreateAssociationMixin, Sequelize } from 'sequelize';
import config from '../config/config.js';

// Question interface for quiz questions
export interface Question {
    questionText: string;
    options: [string, string, string, string];
    correctAnswerIndex: number;
}

// Define the database interface
export interface Database {
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    users: typeof User;
    documents: typeof Document;
    quizzes: typeof Quiz;
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

  // Quiz association
  declare getQuiz: HasOneGetAssociationMixin<Quiz>;
  declare setQuiz: HasOneSetAssociationMixin<Quiz, number>;
  declare createQuiz: HasOneCreateAssociationMixin<Quiz>;
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

// Quiz Model
class Quiz extends Model<InferAttributes<Quiz>, InferCreationAttributes<Quiz>> {
  declare id: CreationOptional<number>;
  declare documentId: ForeignKey<Document['id']>;
  declare questions: Question[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Quiz.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    questions: {
      type: DataTypes.JSONB,
      allowNull: false,
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
    modelName: 'quiz',
    timestamps: true,
  }
);

// Quiz associations
Quiz.belongsTo(Document, {
  foreignKey: 'documentId',
  as: 'document',
  onDelete: 'CASCADE',
});

Document.hasOne(Quiz, {
  sourceKey: 'id',
  foreignKey: 'documentId',
  as: 'quiz',
});

const db = {
  sequelize,
  Sequelize,
  users: User,
  documents: Document,
  quizzes: Quiz,
  userDocuments: UserDocuments,
};
// Note: sync() is called in server.ts, not here, to avoid duplicate sync race conditions

export { db, Quiz };
export default db;
