import { Request, Response } from "express";
import { createNote, deleteNote, getUserNotes, updateNote } from "../services/note.service";
import { noteQuerySchema } from "../validators/noteQuerySchema";
import { AuthRequest } from "../types/request.types";
import { noteSchema } from "../validators/note.schema";
import { ca } from "zod/v4/locales";

export const createNoteController = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.id;
  const result = noteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation error",
      error: result.error.issues,
    });
  }

  try {
    const note = await createNote(userId, result.data);
    return res.status(201).json({
      data: note,
      message: "Note created successfully"
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occured";
    return res.status(500).json({ error: errorMessage });
  }
}

export const getUserNotesController = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.id;
  const parsedQuery = noteQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: parsedQuery.error.issues,
    });
  }
  try {
    const result = await getUserNotes(userId, parsedQuery.data);
    return res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

export const deleteNoteController = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.id;
  const noteId = Number(req.params.id);

  if (!Number.isInteger(noteId) || noteId <= 0) {
    return res.status(400).json({
      message: "Invalid note ID",
    });
  }
  try {
    const result = await deleteNote(userId, noteId);

    if (result.count === 0) {
      return res.status(403).json({
        message: "Note not found or unauthorized",
      });
    }

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export const updateNoteController = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.id;
  const noteId = Number(req.params.id);

  if (!Number.isInteger(noteId) || noteId <= 0) {
    return res.status(400).json({
      message: "Invalid note ID",
    });
  }

  const result = noteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: result.error.issues,
    });
  }

  try {
    const note = await updateNote(userId, noteId, result.data);
    return res.status(200).json({
      data: note,
      message: "Note updated successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Note not found or unauthorized") {
      return res.status(403).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}