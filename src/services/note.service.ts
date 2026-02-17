import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";
import { NoteQueryParams } from "../validators/noteQuerySchema";

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