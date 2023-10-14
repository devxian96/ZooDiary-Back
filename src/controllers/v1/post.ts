import { Router } from "bunApi";
import { ResponseMessage } from "@utils/message";
import { authCheck } from "@utils/authCheck";

const router = Router();

router.post(
  "/post",
  async (req, res) => {
    const userData = await authCheck(req);
    if (userData === undefined) {
      return res
        .status(403)
        .send(ResponseMessage("인증되지 않은 사용자입니다."));
    }

    return res.status(200).send(ResponseMessage("포스트", userData));
  },
  {
    summary: "포스트",
    description: "포스트",
  },
);

export { router as postRouter };
