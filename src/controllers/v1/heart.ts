import { Router } from "bunApi";
import { ResponseMessage } from "@utils/message";
import { authCheck } from "@utils/authCheck";
import { heartUp } from "@services/v1/heart";

const router = Router();

router.post(
  "/heart/:id",
  async (req, res) => {
    const userData = (await authCheck(req)) as string;
    if (userData === undefined) {
      return res
        .status(403)
        .send(ResponseMessage("인증되지 않은 사용자입니다."));
    }

    const id = parseInt(req.params.id, 10);
    const result = await heartUp(id);
    console.log(result);

    return res
      .status(200)
      .send(ResponseMessage("하트가 증가했습니다.", userData));
  },
  {
    summary: "하트 누르기 (Auth Required)",
    description:
      "게시글 id에 해당하는 게시글에 하트를 누릅니다. 첫 누름에는 하트가 증가하고, 다시 누르면 하트가 취소됩니다.",
  },
);

export { router as heartRouter };
