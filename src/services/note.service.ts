import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";
import { NoteQueryParams } from "../validators/noteQuerySchema";
import { NotFoundError } from "../errors/NotFoundError";

export const createNote = async (userId: number, data: { title: string; content: string }) => {
    const { title, content } = data;

    return prisma.note.create({
        data: {
            title,
            content,
            userId,
        }
    });
}

export const getUserNotes = async (userId: number, queryData: NoteQueryParams) => {

    let { page, limit, search, sortBy, sortOrder } = queryData;

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
                }
            },
            {
                content: {
                    contains: search,
                }
            }
        ];
    };

    const skippedItems = (page - 1) * limit;

    const [totalNotes, notes] = await Promise.all([
        prisma.note.count({
            where: whereCondition,
        }),
        prisma.note.findMany({
            where: whereCondition,
            skip: skippedItems,
            take: limit,
            orderBy,
        })
    ]);

    const totalPages = Math.ceil(totalNotes / limit);

    return {
        data: notes,
        pagination: {
            totalNotes,
            totalPages,
            currentPage: page,
            pageSize: limit,
        }
    };
}

export const deleteNote = async (userId: number, noteId: number) => {
    const result = await prisma.note.deleteMany({
        where: {
            id: noteId,
            userId,
        },
    });

    if (result.count === 0) {
        throw new NotFoundError("Note not found or unauthorized");
    }

    return result;
}

export const updateNote = async (userId: number, noteId: number, data: { title: string; content: string }) => {
    const { title, content } = data;

    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            userId: userId,
        },
    });

    if (!note) {
        throw new NotFoundError("Note not found or unauthorized");
    }

    return prisma.note.update({
        where: {
            id: noteId,
        },
        data: {
            title,
            content,
        },
    });
}

export const getNoteById = async (userId: number, noteId: number) => {
    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
        }
    });

    if(!note) {
        throw new NotFoundError("Note not found or unauthorized");
    }

    return note;
}