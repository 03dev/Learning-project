import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createNoteController, deleteNoteController, getUserNotesController, updateNoteController } from "../controllers/note.controller";
import { asyncHander } from "../utils/asyncHander";
import { validateRequest } from "../middleware/validate.middleware";
import { noteSchema, updateNoteSchema } from "../validators/note.schema";

const router = Router();

router.post("/notes", authMiddleware, validateRequest(noteSchema), asyncHander(createNoteController));

router.get("/notes", authMiddleware, asyncHander(getUserNotesController));

router.delete("/delete/:id", authMiddleware, asyncHander(deleteNoteController));

router.put("/update/:id", authMiddleware, validateRequest(updateNoteSchema), asyncHander(updateNoteController));

export default router;
