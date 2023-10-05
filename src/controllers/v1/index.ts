import { Router } from "bunApi";
import { pingRouter } from "./ping";
import { testRouter } from "./test";

const router = Router();

router.group("/v1", (router) => {
  router.use(pingRouter);
  router.use(testRouter);
});

export { router as v1Router };
