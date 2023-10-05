import { Router } from "bunApi";

const router = Router();

router.get(
  "/test",
  (req, res) => {
    return res.send("test");
  },
  {
    summary: "핑",
    description: "서버의 상태를 확인하는 용도의 API",
  }
);

export { router as testRouter };
