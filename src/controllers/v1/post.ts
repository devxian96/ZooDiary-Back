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

    const body = await req.json();
    const picture = body.picture as string;
    const content = body.content as string;
    const chips = body.chips as string;

    return await postWrite(userData, content, picture, chips)
      .then(() => {
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
    description: "담벼락용 사진과 게시글을 작성합니다.",
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
      {
        name: "chips",
        in: "body",
        description: "태그 (,)으로 태그를 구분합니다.",
        required: false,
      },
    ],
  },
);

export { router as postRouter };
