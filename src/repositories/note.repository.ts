import prisma from "../db/prisma"
import { Prisma } from "@prisma/client";
import { UpdateNoteInput } from "../validators/note.schema";

export const createNote = async (userId: number, title: string, content: string) => {
    return prisma.note.create({
        data: {
            title: title,
            content,
            userId,
        }
    });
}

export const getTotalNotesCount = async (whereCondition: any) => {
    return prisma.note.count({
        where: whereCondition,
    });
};

export const getNotes = async (userId: number,
    whereCondition: Prisma.NoteWhereInput,
    skip: number,
    limit: number,
    orderBy: Prisma.NoteOrderByWithRelationInput) => {
    return prisma.note.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy,
    })
}

export const findActiveNoteByIdAndUserId = async (userId: number, noteId: number) => {
    return prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
            deletedAt: null, // only active notes
        }
    });
};

export const updateNoteById = async (noteId: number, data: UpdateNoteInput) => {
    return prisma.note.update({
        where: {
            id: noteId,
        },
        data: data
    });
}

export const findSoftDeletedNoteByIdAndUserId = async (userId: number, noteId: number) => {
    return prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
            deletedAt: {
                not: null, // only soft-deleted notes
            },
        }
    });
}

export const restoreSoftDeletedNote = async (noteId: number) => {
    return prisma.note.update({
        where: {
            id: noteId,
        },
        data: {
            deletedAt: null,
        }
    });
}

export const softDeleteNoteById = async (noteId: number) => {
    const note = await prisma.note.update({
        where: {
            id: noteId,
        },
        data: {
            deletedAt: new Date(),
        }
    });
    return note;
}

export const hardDeleteNoteById = async (noteId: number, userId: number) => {
    return prisma.note.deleteMany({
        where: {
            id: noteId,
            userId,
        }
    });
}

