import { Router } from "bunApi";
import { ResponseMessage } from "@utils/message";
import { authCheck } from "@utils/authCheck";
import { v4 as uuidv4 } from "uuid";

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

    const formData = await req.formData();
    const image = formData.get("image");
    if (!image) {
      return res
        .status(400)
        .send(ResponseMessage("이미지를 찾을 수 없습니다."));
    }

    const ext = (image as File).type.split("/").pop();

    // write image to disk
    const dir = import.meta.dir.split("/");
    const filename = `${uuidv4()}.${ext}`;
    const server = `${dir.splice(0, dir.length - 3).join("/")}/public/images/`;
    const externalUrl = `/images/`;
    await Bun.write(`${server}${filename}`, image);

    return res
      .status(200)
      .send(
        ResponseMessage(
          "이미지가 업로드 되었습니다.",
          `${externalUrl}${filename}`,
        ),
      );
  },
  {
    summary: "이미지 업로드",
    description: "jpg, png, gif 이미지를 업로드 후 이미지 경로를 반환합니다.",
  },
);

export { router as uploadRouter };
