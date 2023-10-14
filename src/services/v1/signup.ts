import { PrismaClient } from "@prisma/client";
import { crypt } from "@utils/crypt";

const prisma = new PrismaClient();

export const signup = async (
  user: string,
  password: string,
  nickName: string,
) => {
  return await prisma.user.create({
    data: {
      user,
      password: crypt(password),
      nickName,
    },
  });
};

export const isFilter = (
  data: string,
  specialChar: boolean,
  koreanChar: boolean,
) => {
  // min length 1
  if (data.length < 1) {
    return true;
  }

  // max length 20
  if (data.length > 20) {
    return true;
  }

  // check special character
  const specialCharacter = /[~!@#$%^&*()_+|<>?:{}]/;
  if (specialChar && specialCharacter.test(data)) {
    return true;
  }

  // check korean
  const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  if (koreanChar && korean.test(data)) {
    return true;
  }

  return false;
};
