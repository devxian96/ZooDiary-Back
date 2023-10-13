import { PrismaClient } from "@prisma/client";
import { crypt } from "@utils/crypt";
import { SignJWT, jwtVerify } from "jose";

const prisma = new PrismaClient();

export const login = async (user: string, password: string) => {
  return await prisma.user.findUnique({
    where: {
      user,
      password: crypt(password),
    },
  });
};

export const createToken = async (user: string) => {
  const secret = Uint8Array.from(
    Array.from(process.env.JWT_SECRET as string).map((letter) =>
      letter.charCodeAt(0),
    ),
  );

  const alg = "HS256";
  return await new SignJWT({
    user,
  })
    .setProtectedHeader({
      alg,
    })
    .setIssuer("ZooDiary")
    .setExpirationTime("1y")
    .sign(secret);
};

export const verifyToken = (token: string) => {
  const secret = Uint8Array.from(
    Array.from(process.env.JWT_SECRET as string).map((letter) =>
      letter.charCodeAt(0),
    ),
  );

  const alg = "HS256";
  return jwtVerify(token, secret, {
    issuer: "ZooDiary",
    algorithms: [alg],
  });
};
