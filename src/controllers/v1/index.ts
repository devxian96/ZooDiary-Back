import { Router } from "bunApi";
import { pingRouter } from "@controllers/v1/ping";
import { signupRouter } from "@controllers/v1/signup";
import { loginRouter } from "@controllers/v1/login";
import { postRouter } from "@controllers/v1/post";
import { uploadRouter } from "@controllers/v1/upload";
import { heartRouter } from "@controllers/v1/heart";

const router = Router();

router.group("/v1", (router) => {
  router.use(pingRouter);
  router.use(signupRouter);
  router.use(loginRouter);
  router.use(postRouter);
  router.use(uploadRouter);
  router.use(heartRouter);
});

export { router as v1Router };
