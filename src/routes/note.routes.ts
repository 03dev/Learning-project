import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { noteSchema, updateNoteSchema } from "../validators/note.schema";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";
import { noteQuerySchema } from "../validators/noteQuerySchema";

const router = Router();

router.post("/notes", authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = noteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: result.error.format(),
    });
  }

  const { title, content } = result.data;

  // store note in db
  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId,
    },
  });

  return res.status(200).json({
    message: "Note created successfully",
    note,
  });
});

router.get("/notes", authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const parsedQuery = noteQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      error: parsedQuery.error.format(),
    });
  }

  let { page, limit, search, sortBy, sortOrder } = parsedQuery.data;

  let orderBy: Prisma.NoteOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  let whereCondition: Prisma.NoteWhereInput = {
    userId,
  };

  if (search) {
    whereCondition.OR = [
      {
        title: {
          contains: search,
        },
      },
      {
        content: {
          contains: search,
        },
      },
    ];
  }

  if (isNaN(page)) page = 1;
  if (isNaN(limit)) limit = 10;

  page = Math.floor(page);
  limit = Math.floor(limit);

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  if (limit > 50) limit = 50;

  const skip = (page - 1) * limit;

  const [totalNotes, notes] = await Promise.all([
    prisma.note.count({
      where: whereCondition,
    }),
    prisma.note.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy,
    }),
  ]);

  const totalPages = Math.ceil(totalNotes / limit);

  return res.status(200).json({
    data: notes,
    pagination: {
      totalNotes,
      totalPages,
      currentPage: page,
      limit,
    },
  });
});

router.delete(
  "/delete/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    console.log("User ID from token: ", userId);
    const note_id = Number(req.params.id);
    if (isNaN(note_id)) {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    // Check if note exists and belongs to user

    // const note = await prisma.note.findUnique({
    //   where: {
    //     id: note_id,
    //   },
    // });

    // if (!note || note.userId !== userId) {
    //   return res.status(403).json({
    //     message: "Note not found or unauthorized",
    //   });
    // }

    // await prisma.note.delete({
    //   where: {
    //     id: note_id,
    //   },
    // });

    const result = await prisma.note.deleteMany({
      where: {
        id: note_id,
        userId,
      },
    });

    if (result.count === 0) {
      return res.status(403).json({
        message: "Note not found or unauthorized",
      });
    }

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  },
);

router.put(
  "/update/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const note_id = Number(req.params.id);

    if (isNaN(note_id)) {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    const result = updateNoteSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.format(),
      });
    }

    const note = prisma.note.findUnique({
      where: {
        id: note_id,
        userId: userId,
      },
    });

    if (!note) {
      return res.status(403).json({
        message: "Note not found or unauthorized",
      });
    }

    const new_note = await prisma.note.update({
      where: {
        id: note_id,
        userId: userId,
      },
      data: {
        ...result.data,
      },
    });

    // const updated_note = await prisma.note.updateMany({
    //   where: {
    //     id: note_id,
    //     userId: userId,
    //   },
    //   data: {
    //     ...result.data,
    //   }
    // });

    // if (updated_note.count === 0) {
    //   return res.status(403).json({
    //     message: "Note not found or unauthorized",
    //   });
    // }

    return res.status(200).json({
      message: "Note updated successfully",
      note: new_note,
    });
  },
);

export default router;
