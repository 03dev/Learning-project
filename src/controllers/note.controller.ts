import { Request, Response } from "express";
import { createNote, deleteNote, getNoteById, getUserNotes, restoreNote, softDeleteNote, updateNote } from "../services/note.service";
import { NoteQueryParams, noteQuerySchema } from "../validators/noteQuerySchema";
import { AppRequest, AuthenticatedRequest } from "../types/request.types";
import { CreateNoteInput, UpdateNoteInput } from "../validators/note.schema";
import { BadRequestError } from "../errors/BadRequestError";
import { NoteIdParam } from "../validators/noteIdParamSchema";
import { ValidatedRequest } from "../types/validate-request.type";

export const createNoteController = async (req: AuthenticatedRequest & Request<{ id: string }, {}, CreateNoteInput>, res: Response) => {
  const userId = req.user.id;
  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }

  const note = await createNote(userId, req.body);

  return res.status(201).json({
    data: note,
    message: "Note created successfully"
  });
}

export const getUserNotesController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const query = req.validated?.query as NoteQueryParams;

  const result = await getUserNotes(userId, query);
  return res.status(200).json(result);
};

export const deleteNoteController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const noteId = Number(req.params.id);

  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new BadRequestError("Invalid note ID");
  }

  await deleteNote(userId, noteId);

  return res.status(200).json({
    message: "Note deleted successfully",
  });
}

export const updateNoteController = async (req: AuthenticatedRequest & Request<{ id: string }, {}, UpdateNoteInput>, res: Response) => {
  const userId = req.user.id;
  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }
  const noteId = Number(req.params.id);

  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new BadRequestError("Invalid note ID");
  }

  const note = await updateNote(userId, noteId, req.body);

  return res.status(200).json({
    data: note,
    message: "Note updated successfully",
  });
}

export const getNoteByIdController = async (req: AuthenticatedRequest & Request<{ id: string }>, res: Response) => {
  const userId = req.user.id;

  const noteId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new BadRequestError("Invalid note ID");
  }

  const note = await getNoteById(userId, noteId);

  return res.status(200).json({
    data: note,
    message: "Note retrieved successfully",
  });
};

export const softDeleteNoteController = async (req: AuthenticatedRequest & ValidatedRequest<NoteIdParam>, res: Response) => {
  const userId = req.user.id;
  const { id } = req.validated.params;

  await softDeleteNote(userId, id);

  return res.status(200).json({
    message: "Note soft deleted successfully",
  });
};

export const restoreNoteController = async (req: AuthenticatedRequest & Request<{ id: string }>, res: Response) => {
  const userId = req.user.id;

  const noteId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new BadRequestError("Invalid note ID");
  }

  const note = await restoreNote(userId, noteId);

  return res.status(200).json({
    data: note,
    message: "Note restored successfully",
  });
};