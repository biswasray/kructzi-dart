import { z } from "zod";
import { constantEntitySchema } from "../base";

export const roleCreateEntity = z.object({
  name: z.string(),
  desc: z.string(),
  level: z.number(),
});

export type IRoleCreate = z.infer<typeof roleCreateEntity>;

export const roleEntity = roleCreateEntity.merge(constantEntitySchema);

export type IRole = z.infer<typeof roleEntity>;

export const roleCreateDto = roleCreateEntity.partial({
  desc: true,
  level: true,
});

export type IRoleCreateDto = z.infer<typeof roleCreateDto>;
