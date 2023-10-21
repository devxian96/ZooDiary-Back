import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const profileUpdate = async (
  userData: string,
  nickName: string,
  picture: string,
) => {
  return await prisma.user.update({
    where: {
      user: userData,
    },
    data: {
      nickName,
      picture,
    },
  });
};
