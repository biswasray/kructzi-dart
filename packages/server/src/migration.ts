import httpContext from "express-http-context";
import { EnRoleLevel } from "@kructzi-dart/universe";
import RoleService from "./services/identity/role";
import AuthService from "./services/identity/auth";
import BaseService from "./services/base";

export async function migrateAll() {
  //   await RoleService.create({
  //     name: "Admin",
  //     level: EnRoleLevel.SuperAdmin,
  //   });
  //   await RoleService.create({
  //     name: "Consumer",
  //     level: EnRoleLevel.Consumer,
  //   });
  //   const admin = await AuthService.register({
  //     username: "john.doe",
  //     password: "Admin@123",
  //     roleLevel: EnRoleLevel.SuperAdmin,
  //     email: "john.doe@aparage.com",
  //   });
  const admin = await AuthService.signIn({
    username: "john.doe",
    password: "Admin@123",
  });
  httpContext.set(BaseService.CurrentUserKey, admin);
}
