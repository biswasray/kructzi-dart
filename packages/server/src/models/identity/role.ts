import { UUID } from "crypto";
import { Sequelize, DataTypes } from "sequelize";
import BaseModel from "../base";
import { IRole } from "@kructzi-dart/universe";

export class Role extends BaseModel<IRole> implements IRole {
  name!: string;
  desc!: string;
  level!: number;
  id!: UUID;
  isActive!: boolean;
  createdAt!: Date;
  createdBy?: UUID | null;
  static initModel(sequelize: Sequelize) {
    return Role.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        desc: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        level: {
          type: DataTypes.INTEGER,
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
      },
      {
        sequelize,
        tableName: "role",
        timestamps: false,
      },
    );
  }
}
