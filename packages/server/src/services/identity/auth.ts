import { Op } from "sequelize";
import httpContext from "express-http-context";
import Models from "../../models";
import RoleService from "./role";
import UserService from "./user";
import BaseService from "../base";
import {
  autoGeneratePassword,
  Encryptor,
  excludeProp,
  generateToken,
  ILoginPayload,
  IUserCreateDto,
  PlatformError,
} from "@kructzi-dart/universe";

export default class AuthService {
  static async register(payload: IUserCreateDto) {
    const {
      roleLevel,
      email,
      username = `${Date.now()}`,
      password = autoGeneratePassword(),
      lastActiveAt = null,
    } = payload;
    const role = await RoleService.get(roleLevel);
    if (!role) {
      throw new PlatformError("Not Found", { messages: "Role not Found" });
    }
    const existingUser = await Models("user").FindOne({
      where: {
        isActive: true,
        [Op.or]: [
          // { email: user.email },
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      throw new PlatformError("Conflict", {
        messages: "User already exist",
      });
    }
    const originalPassword = password;
    const enPassword = Encryptor.encrypt(originalPassword);
    const result = await UserService.create({
      roleId: role.id,
      username,
      password: enPassword,
      email,
      lastActiveAt,
    });
    return excludeProp(result, "password");
  }
  static async signIn(payload: ILoginPayload) {
    const { username, password } = payload;
    const user = await UserService.getByUniqueField(username);
    const validPassword = Encryptor.compareEncryptedData(
      password,
      user.password,
    );
    if (!validPassword) {
      throw new PlatformError("Unauthorized", {
        messages: "invalid credentials",
      });
    }
    const expiresIn = "6h";
    const role = await RoleService.get(user.roleId);
    const userDatails = excludeProp(user, "password");
    const data = {
      ...userDatails,
      role: role && { level: role.level, name: role.name },
    };
    const token = generateToken(data, {});
    httpContext.set(BaseService.CurrentUserKey, user);
    await UserService.updateUser(user.id, { lastActiveAt: new Date() });
    return {
      accessToken: token,
      data,
      expiresIn,
    };
  }
}
