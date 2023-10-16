import { Router } from "bunApi";
import { ResponseMessage } from "@utils/message";
import { login, createToken } from "@services/v1/login";

const router = Router();

router.post(
  "/login",
  async (req, res) => {
    const body = await req.json();
    const user = body.user as string;
    const password = body.password as string;

    return await login(user, password).then(async (userData) => {
      if (!userData) {
        return res
          .status(401)
          .send(ResponseMessage("로그인에 실패하였습니다."));
      }

      const token = await createToken(userData.user);

      return res.status(200).send(
        ResponseMessage("로그인이 완료되었습니다.", {
          user: userData.user,
          nickName: userData.nickName,
          token,
        }),
      );
    });
  },
  {
    summary: "로그인",
    description:
      "사용자의 계정정보를 확인합니다. 로그인이 완료되면 토큰을 발급합니다. https://jwt.io",
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
    ],
  },
);

export { router as loginRouter };
