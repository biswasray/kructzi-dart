import { UUID } from "crypto";
import { z } from "zod";

export function zuuid() {
  return z
    .string()
    .uuid()
    .transform((v) => v as UUID);
}

export const entitySchema = z.object({
  id: zuuid(),
  isActive: z.boolean(),
  createdAt: z.date(),
  createdBy: zuuid().nullish(),
  updatedAt: z.date(),
  updatedBy: zuuid().nullish(),
});

export type IEntity = z.infer<typeof entitySchema>;

export const mapperEntitySchema = z.object({
  id: zuuid(),
  createdAt: z.date(),
  createdBy: zuuid().nullish(),
});

export type IMapperEntity = z.infer<typeof mapperEntitySchema>;

export const extraEntitySchema = entitySchema.extend({
  deletedAt: z.date().nullish(),
  deletedBy: zuuid().nullish(),
});

export type IExtraEntity = z.infer<typeof extraEntitySchema>;
export type IPureEntity<T> = Omit<T, keyof IExtraEntity>;

export const constantEntitySchema = mapperEntitySchema.extend({
  isActive: z.boolean(),
});

export type IConstantEntity = z.infer<typeof constantEntitySchema>;

export const fileSchema = z.object({
  size: z.number(),
  path: z.string(),
  name: z.string(),
  type: z.string(),
  lastModifiedDate: z.date(),
});

export type IFile = z.infer<typeof fileSchema>;
