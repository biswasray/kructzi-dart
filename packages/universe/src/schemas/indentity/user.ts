import { z } from "zod";
import { extraEntitySchema, zuuid } from "../base";

export const userCreateEntity = z.object({
  roleId: zuuid(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  lastActiveAt: z.date().nullish(),
});

export type IUserCreate = z.infer<typeof userCreateEntity>;

export const userEntity = userCreateEntity.merge(extraEntitySchema);

export type IUser = z.infer<typeof userEntity>;

export const userCreateDto = userCreateEntity
  .omit({ roleId: true })
  .extend({ roleLevel: z.number() });

export type IUserCreateDto = z.infer<typeof userCreateDto>;

export const loginPayload = z.object({
  username: z.string(),
  password: z.string(),
});

export type ILoginPayload = z.infer<typeof loginPayload>;

export const loginChunk = userEntity.omit({ password: true }).extend({
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
  deletedAt: z
    .string()
    .nullish()
    .transform((str) => (str ? new Date(str) : str)),
  role: z
    .object({
      level: z.number(),
      name: z.string(),
    })
    .nullable(),
});

export type ILoginChunk = z.infer<typeof loginChunk>;
