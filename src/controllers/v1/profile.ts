import { Router } from "bunApi";
import { ResponseMessage } from "@utils/message";
import { authCheck } from "@utils/authCheck";
import { profileUpdate } from "@services/v1/profile";

const router = Router();

router.put(
  "/profile",
  async (req, res) => {
    const userData = (await authCheck(req)) as string;
    if (userData === undefined) {
      return res
        .status(403)
        .send(ResponseMessage("인증되지 않은 사용자입니다."));
    }

    const body = await req.json();
    const picture = body.picture as string;
    const nickName = body.nickName as string;

    return await profileUpdate(userData, nickName, picture)
      .then(() => {
        return res
          .status(200)
          .send(ResponseMessage("프로필이 수정되었습니다."));
      })
      .catch(() => {
        return res
          .status(500)
          .send(
            ResponseMessage("알 수 없는 오류로 프로필이 수정되지 않았습니다."),
          );
      });
  },
  {
    summary: "프로필 수정 (Auth Required)",
    description: "프로필을 수정합니다.",
    parameters: [
      {
        name: "nickName",
        in: "body",
        required: true,
        description: "닉네임",
      },
      {
        name: "picture",
        in: "body",
        required: true,
        description: "프로필 사진",
      },
    ],
  },
);

export { router as profileRouter };
