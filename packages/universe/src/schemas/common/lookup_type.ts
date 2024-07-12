import { z } from "zod";
import { constantEntitySchema, zuuid } from "../base";

export const lookupTypeCreateEntity = z.object({
  level: z.number(),
  desc: z.string().nullish(),
  code: z.string(),
  parentLookupTypeId: zuuid().nullish(),
});

export type ILookupTypeCreate = z.infer<typeof lookupTypeCreateEntity>;

export const lookupTypeEntity =
  lookupTypeCreateEntity.merge(constantEntitySchema);

export type ILookupType = z.infer<typeof lookupTypeEntity>;

export const lookupTypeCreateDto = lookupTypeCreateEntity.partial({
  level: true,
});

export type ILookupTypeCreateDto = z.infer<typeof lookupTypeCreateDto>;
