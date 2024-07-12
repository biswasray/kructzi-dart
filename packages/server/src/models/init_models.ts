import { Sequelize } from "sequelize";
import { User } from "./identity/user";
import { Role } from "./identity/role";
import { ProfileField } from "./identity/profile_field";
import { ProfileDetail } from "./identity/profile_detail";
import { Lookup } from "./common/lookup";
import { LookupType } from "./common/lookup_type";

export function initModels(sequelize: Sequelize) {
  const role = Role.initModel(sequelize);
  const user = User.initModel(sequelize);
  const profile_field = ProfileField.initModel(sequelize);
  const profile_detail = ProfileDetail.initModel(sequelize);
  const lookup_type = LookupType.initModel(sequelize);
  const lookup = Lookup.initModel(sequelize);

  return {
    role,
    user,
    profile_field,
    profile_detail,
    lookup_type,
    lookup,
  };
}
