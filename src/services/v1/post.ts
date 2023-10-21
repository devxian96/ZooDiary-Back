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

export const postUpdate = async (
  id: number,
  user: string,
  content: string,
  picture?: string,
  chips?: string,
) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      user: {
        select: {
          user: true,
        },
      },
    },
  });

  if (post?.user.user !== user) {
    throw new Error("권한이 없습니다.");
  }

  return await prisma.post.update({
    where: {
      id,
    },
    data: {
      content,
      picture,
      chips,
    },
  });
};

export const postRead = async (
  limit: number = 10,
  offset: number = 0,
  user?: string,
) => {
  // Heart count of each post

  return await prisma.post.findMany({
    take: limit,
    skip: offset,
    where: {
      user: {
        user: user,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          nickName: true,
          picture: true,
        },
      },

      Heart: {
        select: {
          user: {
            select: {
              nickName: true,
              picture: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });
};

export const postDelete = async (id: number, user: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      user: {
        select: {
          user: true,
        },
      },
    },
  });

  if (post?.user.user !== user) {
    throw new Error("권한이 없습니다.");
  }

  return await prisma.post.delete({
    where: {
      id,
    },
  });
};
