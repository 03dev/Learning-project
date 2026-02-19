import { z } from 'zod';

export const noteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().trim().min(3, "Content is required")
}).strict();

export const updateNoteSchema = z.object({
    content: z.string().trim().min(3, "Content is required")
}).strict();

export type CreateNoteInput = z.infer<typeof noteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;