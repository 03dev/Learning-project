import { Request, Response } from "express";
import { createNote, deleteNote, getUserNotes, updateNote } from "../services/note.service";
import { noteQuerySchema } from "../validators/noteQuerySchema";
import { AuthRequest } from "../types/request.types";
import { noteSchema } from "../validators/note.schema";
import { BadRequestError } from "../errors/BadRequestError";

export const createNoteController = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }
  const result = noteSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError("Validation error: " + JSON.stringify(result.error.issues));
  }

  const note = await createNote(userId, result.data);

  return res.status(201).json({
    data: note,
    message: "Note created successfully"
  });
}

export const getUserNotesController = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }
  const parsedQuery = noteQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    throw new BadRequestError("Validation error: " + JSON.stringify(parsedQuery.error.issues));
  }

  const result = await getUserNotes(userId, parsedQuery.data);
  return res.status(200).json(result);
};

export const deleteNoteController = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }
  const noteId = Number(req.params.id);

  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new BadRequestError("Invalid note ID");
  }

  await deleteNote(userId, noteId);

  return res.status(200).json({
    message: "Note deleted successfully",
  });
}

export const updateNoteController = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }
  const noteId = Number(req.params.id);

  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new BadRequestError("Invalid note ID");
  }

  const result = noteSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError("Validation error: " + JSON.stringify(result.error.issues));
  }

  const note = await updateNote(userId, noteId, result.data);

  return res.status(200).json({
    data: note,
    message: "Note updated successfully",
  });
}