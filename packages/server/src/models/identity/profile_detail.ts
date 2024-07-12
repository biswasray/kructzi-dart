import { UUID } from "crypto";
import { Sequelize, DataTypes } from "sequelize";
import BaseModel from "../base";
import { IProfileDetail } from "@kructzi-dart/universe";

export class ProfileDetail
  extends BaseModel<IProfileDetail>
  implements IProfileDetail
{
  id!: UUID;
  createdAt!: Date;
  isActive!: boolean;
  createdBy?: UUID | null | undefined;
  updatedAt!: Date;
  updatedBy?: UUID | null | undefined;
  fieldId!: UUID;
  answer!: string;
  static initModel(sequelize: Sequelize) {
    return ProfileDetail.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
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
        fieldId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        answer: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "profiledetail",
        timestamps: false,
      },
    );
  }
}
