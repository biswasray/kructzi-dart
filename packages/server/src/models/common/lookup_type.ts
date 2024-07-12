import { UUID } from "crypto";
import { Sequelize, DataTypes } from "sequelize";
import BaseModel from "../base";
import { ILookupType } from "@kructzi-dart/universe";

export class LookupType extends BaseModel<ILookupType> implements ILookupType {
  id!: UUID;
  level!: number;
  code!: string;
  createdAt!: Date;
  isActive!: boolean;
  desc?: string | null | undefined;
  parentLookupTypeId?: UUID | null | undefined;
  createdBy?: UUID | null | undefined;
  static initModel(sequelize: Sequelize) {
    return LookupType.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        parentLookupTypeId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        code: {
          type: DataTypes.STRING,
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
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        desc: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "lookuptype",
        timestamps: false,
      },
    );
  }
}
