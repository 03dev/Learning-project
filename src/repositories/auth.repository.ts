import prisma from "../db/prisma";

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
}

export const createUser = async (email: string, passwordHash: string) => {
    return prisma.user.create({
        data: {
            email: email,
            passwordHash
        }
    });
}