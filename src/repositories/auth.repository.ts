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

// create new token
export const createRefreshToken = async (userId: number) => {
    return prisma.refreshToken.create({
        data: {
            userId,
            token: "temp",
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        }
    });
}

export const updateRefreshToken = async (tokenId: number, hashedToken: string) => {
    await prisma.refreshToken.update({
        where: {
            id: tokenId
        },
        data: {
            token: hashedToken
        }
    })
}

// on logout - delete specific token
export const deleteRefreshToken = async (id: number) => {
    return prisma.refreshToken.delete({
        where: { id }
    });
}

// get token by tokenId
export const getRefreshTokenByTokenId = async (tokenId: number) => {
  return prisma.refreshToken.findUnique({
    where: { id: tokenId }
  });
};