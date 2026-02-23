import { z } from 'zod';

export const noteQuerySchema = z.object({
    page: z.coerce.number().int().positive().min(1).default(1),
    limit: z.coerce.number().int().positive().min(1).max(50).default(10),
    search: z.string().trim().optional().default(""),
    sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc")
});

export type NoteQueryParams = z.infer<typeof noteQuerySchema>;