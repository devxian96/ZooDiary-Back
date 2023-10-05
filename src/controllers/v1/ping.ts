import { Router } from "bunApi";

const router = Router();

router.get(
  "/ping",
  (req, res) => {
    return res.send("pong");
  },
  {
    summary: "핑",
    description: "서버의 상태를 확인하는 용도의 API",
  },
);

export { router as pingRouter };
