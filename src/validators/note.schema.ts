import { z } from 'zod';

export const noteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().trim().min(3, "Content is required")
});

export const updateNoteSchema = z.object({
    content: z.string().trim().min(3, "Content is required")
});