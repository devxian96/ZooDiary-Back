import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const signup = async (
  user: string,
  password: string,
  nickName: string,
) => {
  return await prisma.user.create({
    data: {
      user,
      password,
      nickName,
    },
  });
};

export const isFilter = (data: string) => {
  // min length 4
  if (data.length < 4) {
    return true;
  }

  // max length 20
  if (data.length > 20) {
    return true;
  }

  // check special character
  const specialCharacter = /[~!@#$%^&*()_+|<>?:{}]/;
  if (specialCharacter.test(data)) {
    return true;
  }

  // check korean
  const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  if (korean.test(data)) {
    return true;
  }

  return false;
};
