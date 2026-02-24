import prisma from "../db/prisma"

export const findActiveNotesByIdAndUserId = async (userId: number, noteId: number) => {
    return prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
            deletedAt: null, // only active notes
        }
    });
};

export const softDeleteById = async (noteId: number) => {
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