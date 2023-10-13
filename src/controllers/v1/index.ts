import { Router } from "bunApi";
import { pingRouter } from "@controllers/v1/ping";
import { signupRouter } from "@controllers/v1/signup";
import { loginRouter } from "@controllers/v1/login";

const router = Router();

router.group("/v1", (router) => {
  router.use(pingRouter);
  router.use(signupRouter);
  router.use(loginRouter);
});

export { router as v1Router };
