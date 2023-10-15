import { Router } from "bunApi";
import { ResponseMessage } from "@utils/message";
import { authCheck } from "@utils/authCheck";
import { postWrite } from "@services/v1/post";

const router = Router();

router.post(
  "/post",
  async (req, res) => {
    const userData = (await authCheck(req)) as string;
    if (userData === undefined) {
      return res
        .status(403)
        .send(ResponseMessage("인증되지 않은 사용자입니다."));
    }

    const picture = req?.body?.picture as string;
    const content = req?.body?.content as string;

    return await postWrite(userData, content, picture)
      .then((data) => {
        console.log(data);
        return res
          .status(200)
          .send(ResponseMessage("게시글이 작성되었습니다."));
      })
      .catch(() => {
        return res
          .status(500)
          .send(
            ResponseMessage("알 수 없는 오류로 게시글이 작성되지 않았습니다."),
          );
      });
  },
  {
    summary: "글쓰기",
    description: "사진과 ",
    parameters: [
      {
        name: "picture",
        in: "body",
        description: "사진경로 (,)으로 사진을 구분합니다.",
        required: false,
      },
      {
        name: "content",
        in: "body",
        description: "일기 내용",
        required: true,
      },
    ],
  },
);

export { router as postRouter };
