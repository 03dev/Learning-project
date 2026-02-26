import { Request, Response } from "express";
import { createNote, deleteNote, getNoteById, getUserNotes, restoreNote, softDeleteNote, updateNote } from "../services/note.service";
import { NoteQueryParams } from "../validators/noteQuerySchema";
import { AuthenticatedRequest } from "../types/request.types";
import { CreateNoteInput, UpdateNoteInput } from "../validators/note.schema";
import { BadRequestError } from "../errors/BadRequestError";
import { NoteIdParam } from "../validators/noteIdParamSchema";
import { ValidatedRequest } from "../types/validate-request.types";

export const createNoteController = async (req: AuthenticatedRequest & ValidatedRequest<{}, {}, CreateNoteInput>, res: Response) => {
  const userId = req.user.id;
  const note = await createNote(userId, req.validated.body);

  return res.status(201).json({
    data: note,
    message: "Note created successfully"
  });
}

export const getUserNotesController = async (req: AuthenticatedRequest & ValidatedRequest<NoteIdParam, NoteQueryParams>, res: Response) => {
  const userId = req.user.id;
  const query = req.validated.query;

  const result = await getUserNotes(userId, query);
  return res.status(200).json(result);
};

export const deleteNoteController = async (req: AuthenticatedRequest & ValidatedRequest<NoteIdParam>, res: Response) => {
  const userId = req.user.id;
  const noteId = req.validated.params.id;

  await deleteNote(userId, noteId);

  return res.status(200).json({
    message: "Note deleted successfully",
  });
}

export const updateNoteController = async (req: AuthenticatedRequest & ValidatedRequest<NoteIdParam, {}, UpdateNoteInput>, res: Response) => {
  const userId = req.user.id;
  const noteId = req.validated.params.id;
  const note = await updateNote(userId, noteId, req.validated.body);

  return res.status(200).json({
    data: note,
    message: "Note updated successfully",
  });
}

export const getNoteByIdController = async (req: AuthenticatedRequest & ValidatedRequest<NoteIdParam>, res: Response) => {
  const userId = req.user.id;
  const noteId = req.validated.params.id;
  const note = await getNoteById(userId, noteId);

  return res.status(200).json({
    data: note,
    message: "Note retrieved successfully",
  });
};

export const softDeleteNoteController = async (req: AuthenticatedRequest & ValidatedRequest<NoteIdParam>, res: Response) => {
  const userId = req.user.id;
  const noteId = req.validated.params.id;

  await softDeleteNote(userId, noteId);

  return res.status(200).json({
    message: "Note deleted successfully",
  });
};

export const restoreNoteController = async (req: AuthenticatedRequest & ValidatedRequest<NoteIdParam>, res: Response) => {
  const userId = req.user.id;
  const noteId = req.validated.params.id;
  const note = await restoreNote(userId, noteId);

  return res.status(200).json({
    data: note,
    message: "Note restored successfully",
  });
};