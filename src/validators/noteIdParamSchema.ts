import { z } from "zod";

export const noteIdParamSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive(),
});

export type NoteIdParam = z.infer<typeof noteIdParamSchema>;