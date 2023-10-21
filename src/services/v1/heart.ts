import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const heartUp = async (id: number) => {
  // 같은 유저가 같은 게시글에 하트를 누르면 하트를 취소합니다.
  const heart = await prisma.heart.findFirst({
    where: {
      postId: id,
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

  await prisma.heart.create({
    data: {
      postId: id,
      userId: 1, // Replace 1 with the actual user ID
    },
  });

  return true;
};
