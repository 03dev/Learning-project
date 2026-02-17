import { Request, Response } from "express";
import { getUserNotes } from "../services/note.service";
import { noteQuerySchema } from "../validators/noteQuerySchema";
import { AuthRequest } from "../types/request.types";

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
