import { Router } from "bunApi";
import { ResponseMessage } from "@utils/message";
import { signup, isFilter } from "@services/v1/signup";

const router = Router();

router.post(
  "/signup",
  async (req, res) => {
    const user = req?.body?.user as string;
    const password = req?.body?.password as string;
    const nickName = req?.body?.nickName as string;

    if (isFilter(user) || isFilter(password) || isFilter(nickName)) {
      return res.status(400).send(ResponseMessage("잘못된 정보가 있습니다."));
    }

    return await signup(user, password, nickName)
      .then(() => {
        return res
          .status(200)
          .send(ResponseMessage("회원가입이 완료되었습니다."));
      })
      .catch((error) => {
        const key = error.meta.target.split("_")[1];

        return res
          .status(400)
          .send(ResponseMessage("중복된 정보가 있습니다.", key));
      });
  },
  {
    summary: "회원가입",
    description: "새로운 사용자의 계정정보를 생성합니다.",
    parameters: [
      {
        name: "user",
        in: "body",
        description: "사용자 아이디",
        required: true,
      },
      {
        name: "password",
        in: "body",
        description: "사용자 비밀번호",
        required: true,
      },
      {
        name: "nickName",
        in: "body",
        description: "사용자 닉네임",
        required: true,
      },
    ],
  },
);

export { router as signupRouter };
