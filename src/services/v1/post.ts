import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const postWrite = async (
  user: string,
  content: string,
  picture?: string,
  chips?: string,
) => {
  return await prisma.post.create({
    data: {
      user: {
        connect: {
          user: user,
        },
      },
      content,
      picture,
      chips,
    },
  });
};
