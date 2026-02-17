import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createNoteController, deleteNoteController, getUserNotesController, updateNoteController } from "../controllers/note.controller";

const router = Router();

router.post("/notes", authMiddleware, createNoteController);

router.get("/notes", authMiddleware, getUserNotesController);

router.delete("/delete/:id", authMiddleware, deleteNoteController);

router.put("/update/:id", authMiddleware, updateNoteController);

export default router;
