import { UUID } from "crypto";
import { Sequelize, DataTypes } from "sequelize";
import BaseModel from "../base";
import { IProfileField } from "@kructzi-dart/universe";

export class ProfileField
  extends BaseModel<IProfileField>
  implements IProfileField
{
  columnName!: string;
  headerName!: string;
  desc!: string;
  sequence!: number;
  columnLookupCode!: string;
  staticOptions?: string | null | undefined;
  refLookupTypeId?: UUID | null | undefined;
  isRequired!: boolean;
  id!: UUID;
  isActive!: boolean;
  createdAt!: Date;
  createdBy?: UUID | null;
  updatedAt!: Date;
  updatedBy?: UUID | null;

  static initModel(sequelize: Sequelize) {
    return ProfileField.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        columnName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        headerName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        desc: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        columnLookupCode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        staticOptions: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        refLookupTypeId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        isRequired: {
          type: DataTypes.BOOLEAN,
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
      },
      {
        sequelize,
        tableName: "profilefield",
        timestamps: false,
      },
    );
  }
}
