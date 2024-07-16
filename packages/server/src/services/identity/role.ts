import { randomUUID } from "crypto";
import { IRoleCreateDto, PlatformError } from "@kructzi-dart/universe";
import Models from "../../models";

export default class RoleService {
  static async get(id: string | number) {
    id = isNaN(Number(id)) ? id : Number(id);
    return await Models("role").FindOne({
      where: {
        isActive: true,
        ...(typeof id === "number" ? { level: id } : { id }),
      },
    });
  }
  static async create(role: IRoleCreateDto) {
    // if (typeof role.level !== "number") {
    //   delete (role as Record<string, unknown>).level;
    // }
    if (!role.name) {
      throw new PlatformError("Bad Request", {
        messages: "Role is not Provided",
      });
    }
    const prevLevel = await Models("role").FindOne({
      where: {
        isActive: true,
      },
      order: [["level", "DESC"]],
    });
    const result = await Models("role").create({
      id: randomUUID(),
      isActive: true,
      createdAt: new Date(),
      level: (prevLevel?.level ?? 0) + 1,
      desc: role.name,
      ...role,
    });
    return !!result;
  }
  static async getAll() {
    return await Models("role").FindAll({ where: { isActive: true } });
  }
}
