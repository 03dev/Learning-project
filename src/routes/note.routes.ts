import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { noteSchema, updateNoteSchema } from "../validators/note.schema";
import prisma from "../db/prisma";
import { error } from "node:console";

const router = Router();

router.post('/notes', authMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const result = noteSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: result.error.format()
        });
    }

    const { title, content } = result.data;

    // store note in db
    const note = await prisma.note.create({
        data: {
            title,
            content,
            userId
        }
    });

    return res.status(200).json({
        message: "Note created successfully",
        note
    })
});

router.get('/notes', authMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const notes = await prisma.note.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return res.status(200).json({
        notes
    })
});

router.delete('/delete/:id', authMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    console.log("User ID from token: ", userId);
    const note_id = Number(req.params.id);
    if(isNaN(note_id)) {
        return res.status(400).json({
            message: "Invalid ID"
        })
    }

    const note = await prisma.note.findUnique({
        where: {
            id: note_id
        }
    });

    if(!note || note.userId !== userId) {
        return res.status(403).json({
            message: "Note not found or unauthorized"
        })
    }

    await prisma.note.delete({
        where: {
            id: note_id
        }
    });

    return res.status(200).json({
        message: "Note deleted successfully"
    });
});

router.put('/update/:id', authMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const note_id = Number(req.params.id);

    if(isNaN(note_id)) {
        return res.status(400).json({
            message: "Invalid ID"
        });
    }

    const result = updateNoteSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: result.error.format()
        });
    }

    const note = prisma.note.findUnique({
        where: {
            id: note_id,
            userId: userId
        }
    })

    if(!note) {
        return res.status(403).json({
            message: "Note not found or unauthorized"
        });
    }

    const new_note = await prisma.note.update({
        where: {
            id: note_id,
            userId: userId
        },
        data: {
            ...result.data
        }
    });

    return res.status(200).json({
        message: "Note updated successfully",
        note: new_note
    });
});

export default router;