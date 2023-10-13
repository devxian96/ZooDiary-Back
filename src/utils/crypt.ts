import { SHA256 } from "crypto-js";

export const crypt = (password: string) => {
  return SHA256(password).toString();
};
