import { Prisma } from "@prisma/client";
import { NoteQueryParams } from "../validators/noteQuerySchema";
import { NotFoundError } from "../errors/NotFoundError";
import * as NoteRepository from "../repositories/note.repository";
import { UpdateNoteInput } from "../validators/note.schema";

export const createNote = async (userId: number, data: { title: string; content: string }) => {
    const { title, content } = data;

    return NoteRepository.createNote(userId, title, content);
}

export const getUserNotes = async (userId: number, queryData: NoteQueryParams) => {
    const { page, limit, search, sortBy, sortOrder } = queryData;

    const orderBy: Prisma.NoteOrderByWithRelationInput = {
        [sortBy]: sortOrder,
    };

    const whereCondition: Prisma.NoteWhereInput = {
        userId,
        deletedAt: null, // only active notes
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
        NoteRepository.getTotalNotesCount(whereCondition),
        NoteRepository.getNotes(userId, whereCondition, skippedItems, limit, orderBy)
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
    const result = await NoteRepository.hardDeleteNoteById(noteId, userId);

    if (result.count === 0) {
        throw new NotFoundError("Note not found or unauthorized");
    }

    return result;
}

export const updateNote = async (userId: number, noteId: number, data: UpdateNoteInput) => {
    const note = await NoteRepository.findActiveNoteByIdAndUserId(userId, noteId);

    if (!note) {
        throw new NotFoundError("Note not found or unauthorized");
    }

    return NoteRepository.updateNoteById(noteId, data);
}

export const getNoteById = async (userId: number, noteId: number) => {
    const note = await NoteRepository.findActiveNoteByIdAndUserId(userId, noteId);

    if (!note) {
        throw new NotFoundError("Note not found or unauthorized");
    }

    return note;
}

export const softDeleteNote = async (userId: number, noteId: number) => {
    const note = await NoteRepository.findActiveNoteByIdAndUserId(userId, noteId);

    if (!note) {
        throw new NotFoundError("Note not found");
    }

    return NoteRepository.softDeleteNoteById(noteId);
}

export const restoreNote = async (userId: number, noteId: number) => {
    const note = await NoteRepository.findSoftDeletedNoteByIdAndUserId(userId, noteId);

    if (!note) {
        throw new NotFoundError("Note not found or not deleted");
    }

    return NoteRepository.restoreSoftDeletedNote(noteId);
}