import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createNoteController, deleteNoteController, getNoteByIdController, getUserNotesController, restoreNoteController, softDeleteNoteController, updateNoteController } from "../controllers/note.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middleware/validate.middleware";
import { noteSchema, updateNoteSchema } from "../validators/note.schema";
import { noteQuerySchema } from "../validators/noteQuerySchema";
import { noteIdParamSchema } from "../validators/noteIdParamSchema";

const router = Router();

router.post("/notes", authMiddleware, validateRequest({body: noteSchema}), asyncHandler(createNoteController));

router.get("/notes", authMiddleware,validateRequest({query: noteQuerySchema}), asyncHandler(getUserNotesController));

router.delete("/delete/:id", authMiddleware, validateRequest({params: noteIdParamSchema}), asyncHandler(deleteNoteController));

router.put("/update/:id", authMiddleware, validateRequest({body: updateNoteSchema, params: noteIdParamSchema}), asyncHandler(updateNoteController));

router.get("/notes/:id", authMiddleware, validateRequest({params: noteIdParamSchema}), asyncHandler(getNoteByIdController));

router.delete("/notes/:id", authMiddleware, validateRequest({params: noteIdParamSchema}),asyncHandler(softDeleteNoteController));

router.patch("/notes/:id/restore", authMiddleware, validateRequest({params: noteIdParamSchema}), asyncHandler(restoreNoteController));

export default router;
