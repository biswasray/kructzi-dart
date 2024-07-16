import { z } from "zod";
import { entitySchema, zuuid } from "../base";

export const profileFieldCreateEntity = z.object({
  columnName: z.string(),
  headerName: z.string(),
  desc: z.string().nullish(),
  sequence: z.number(),
  columnLookupCode: z.string(),
  isRequired: z.boolean(),
  staticOptions: z.string().nullish(),
  refLookupTypeId: zuuid().nullish(),
});

export type IProfileFieldCreate = z.infer<typeof profileFieldCreateEntity>;

export const profileFieldEntity = profileFieldCreateEntity.merge(entitySchema);

export type IProfileField = z.infer<typeof profileFieldEntity>;

export const profileFieldCreateDto = profileFieldCreateEntity.partial({
  desc: true,
  sequence: true,
});

export type IProfileFieldCreateDto = z.infer<typeof profileFieldCreateDto>;
