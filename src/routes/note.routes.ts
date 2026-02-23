import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createNoteController, deleteNoteController, getNoteByIdController, getUserNotesController, softDeleteNoteController, updateNoteController } from "../controllers/note.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middleware/validate.middleware";
import { noteSchema, updateNoteSchema } from "../validators/note.schema";

const router = Router();

router.post("/notes", authMiddleware, validateRequest(noteSchema), asyncHandler(createNoteController));

router.get("/notes", authMiddleware, asyncHandler(getUserNotesController));

router.delete("/delete/:id", authMiddleware, asyncHandler(deleteNoteController));

router.put("/update/:id", authMiddleware, validateRequest(updateNoteSchema), asyncHandler(updateNoteController));

router.get("/notes/:id", authMiddleware, asyncHandler(getNoteByIdController));

router.delete("/notes/:id", authMiddleware, asyncHandler(softDeleteNoteController));

export default router;
