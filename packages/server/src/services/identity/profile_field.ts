import { IProfileFieldCreateDto } from "@kructzi-dart/universe";
import Models from "../../models";

export default class ProfileFieldService {
  static async create(lookupType: IProfileFieldCreateDto) {
    const {
      columnName,
      columnLookupCode,
      headerName,
      isRequired,
      desc = headerName,
      sequence,
      staticOptions = null,
      refLookupTypeId = null,
    } = lookupType;
    const prevField = await Models("profile_field").FindOne({
      where: {
        isActive: true,
      },
      order: [["level", "DESC"]],
    });
    const result = await Models("profile_field").Create({
      columnName,
      columnLookupCode,
      headerName,
      isRequired,
      desc,
      sequence: (sequence ?? prevField?.sequence ?? 0) + 1,
      staticOptions,
      refLookupTypeId,
    });
    return !!result;
  }
  static async getAllProfileFields() {
    const result = await Models("profile_field").FindAll({
      where: {
        isActive: true,
      },
    });
    return result;
  }
}
