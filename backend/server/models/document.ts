import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface DocumentAttributes {
  id: string;
  userId: string;
  s3Path: string;
  summary: string;
  title: string;
  tags?: string[] | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id' | 'tags' | 'createdAt' | 'updatedAt'> {
  userId: string;
  s3Path: string;
  summary: string;
  title: string;
}

class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public id!: string;
  public userId!: string;
  public s3Path!: string;
  public summary!: string;
  public title!: string;
  public tags!: string[] | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): void {
    Document.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.STRING,
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
      },
      {
        sequelize,
        modelName: 'document',
        timestamps: true,
      }
    );
  }
}

export { Document };
export default Document;
