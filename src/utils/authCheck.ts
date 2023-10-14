import type { RequestWithOmit } from "bunApi";
import { verifyToken } from "@services/v1/login";

export const authCheck = async (req: RequestWithOmit) => {
  const token = req.header.get("Authorization")?.split(" ")[1];

  return await verifyToken(token as string)
    .then((result) => {
      return result.payload.user;
    })
    .catch(() => {
      return;
    });
};
