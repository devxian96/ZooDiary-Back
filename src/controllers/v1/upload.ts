import { Router } from "bunApi";
import { ResponseMessage } from "@utils/message";
import { authCheck } from "@utils/authCheck";

const router = Router();

router.post(
  "/upload",
  async (req, res) => {
    const userData = (await authCheck(req)) as string;
    if (userData === undefined) {
      return res
        .status(403)
        .send(ResponseMessage("인증되지 않은 사용자입니다."));
    }

    return res.status(200).send(ResponseMessage("이미지가 업로드 되었습니다."));
  },
  {
    summary: "이미지 업로드",
    description: "jpg, png, gif 이미지를 업로드 후 이미지 경로를 반환합니다.",
  },
);

export { router as uploadRouter };
