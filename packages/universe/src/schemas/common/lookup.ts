import { z } from "zod";
import { constantEntitySchema, zuuid } from "../base";

export const lookupCreateEntity = z.object({
  lookupTypeId: zuuid(),
  name: z.string(),
  level: z.number(),
  desc: z.string().nullish(),
  sequence: z.number(),
  code: z.string(),
  parentLookupCode: z.string().nullish(),
});

export type ILookUpCreate = z.infer<typeof lookupCreateEntity>;

export const lookupEntity = lookupCreateEntity.merge(constantEntitySchema);

export type ILookup = z.infer<typeof lookupEntity>;

export const lookupCreateDto = lookupCreateEntity.partial({
  sequence: true,
  level: true,
});

export type ILookupCreateDto = z.infer<typeof lookupCreateDto>;
