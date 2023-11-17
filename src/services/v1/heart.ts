import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const heartUp = async (id: number, userData: string) => {
  // 같은 유저가 같은 게시글에 하트를 누르면 하트를 취소합니다.
  const heart = await prisma.heart.findFirst({
    where: {
      postId: id,
      user: {
        user: userData,
      },
    },
  });

  if (heart) {
    await prisma.heart.delete({
      where: {
        id: heart.id,
      },
    });
    return false;
  }

  const userId = await prisma.user.findUnique({
    where: {
      user: userData,
    },
    select: {
      id: true,
    },
  });

  await prisma.heart.create({
    data: {
      postId: id,
      userId: userId?.id as number,
    },
  });

  return true;
};
