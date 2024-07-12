import { UUID } from "crypto";
import { Sequelize, DataTypes } from "sequelize";
import BaseModel from "../base";
import { IUser } from "@kructzi-dart/universe";

export class User extends BaseModel<IUser> implements IUser {
  id!: UUID;
  isActive!: boolean;
  createdAt!: Date;
  createdBy?: UUID | null;
  updatedAt!: Date;
  updatedBy?: UUID | null;
  deletedAt?: Date | null;
  deletedBy?: UUID | null;
  username!: string;
  password!: string;
  roleId!: UUID;
  email!: string;
  static initModel(sequelize: Sequelize) {
    return User.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        username: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        password: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        roleId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deletedBy: {
          type: DataTypes.UUID,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "user",
        timestamps: false,
      },
    );
  }
}
