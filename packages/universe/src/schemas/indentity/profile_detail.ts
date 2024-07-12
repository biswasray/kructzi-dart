import { z } from "zod";
import { entitySchema, zuuid } from "../base";

export const profileDetailCreateEntity = z.object({
  fieldId: zuuid(),
  answer: z.string(),
});

export type IProfileDetailCreate = z.infer<typeof profileDetailCreateEntity>;

export const profileDetailEntity =
  profileDetailCreateEntity.merge(entitySchema);

export type IProfileDetail = z.infer<typeof profileDetailEntity>;
