import { UUID } from "crypto";
import { Sequelize, DataTypes } from "sequelize";
import BaseModel from "../base";
import { ILookup } from "@kructzi-dart/universe";

export class Lookup extends BaseModel<ILookup> implements ILookup {
  id!: UUID;
  isActive!: boolean;
  createdAt!: Date;
  code!: string;
  lookupTypeId!: UUID;
  name!: string;
  level!: number;
  sequence!: number;
  desc?: string | null | undefined;
  parentLookupCode?: string | null | undefined;
  createdBy?: UUID | null | undefined;
  static initModel(sequelize: Sequelize) {
    return Lookup.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
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
        lookupTypeId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        desc: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        parentLookupCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "lookup",
        timestamps: false,
      },
    );
  }
}
