import { Router } from "bunApi";
import { ResponseMessage } from "@utils/message";
import { authCheck } from "@utils/authCheck";
import { postWrite, postRead, postDelete, postUpdate } from "@services/v1/post";

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
    summary: "글쓰기 (Auth Required)",
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

router.get(
  "/post",
  async (req, res) => {
    const userData = (await authCheck(req)) as string;
    if (userData === undefined) {
      return res
        .status(403)
        .send(ResponseMessage("인증되지 않은 사용자입니다."));
    }

    const limit = parseInt((req.query.get("limit") as string) ?? 10, 10);
    const offset = parseInt((req.query.get("offset") as string) ?? 0, 10);

    const result = await postRead(limit, offset);

    return res
      .status(200)
      .send(ResponseMessage("담벼락을 가져왔습니다.", result));
  },
  {
    summary: "담벼락 글 가져오기 (Auth Required)",
    description: "담벼락 글을 가져옵니다.",
    parameters: [
      {
        name: "limit",
        in: "query",
        description: "한 페이지에 가져올 글 수",
        required: false,
      },
      {
        name: "offset",
        in: "query",
        description: "가져올 페이지",
        required: false,
      },
    ],
  },
);

router.get(
  "/post/mypage",
  async (req, res) => {
    const userData = (await authCheck(req)) as string;
    if (userData === undefined) {
      return res
        .status(403)
        .send(ResponseMessage("인증되지 않은 사용자입니다."));
    }

    const limit = parseInt((req.query.get("limit") as string) ?? 10, 10);
    const offset = parseInt((req.query.get("offset") as string) ?? 0, 10);

    const result = await postRead(limit, offset, userData);

    return res
      .status(200)
      .send(ResponseMessage("내 담벼락을 가져왔습니다.", result));
  },
  {
    summary: "내 담벼락 글 가져오기 (Auth Required)",
    description: "내 담벼락 글을 가져옵니다.",
    parameters: [
      {
        name: "limit",
        in: "query",
        description: "한 페이지에 가져올 글 수",
        required: false,
      },
      {
        name: "offset",
        in: "query",
        description: "가져올 페이지",
        required: false,
      },
    ],
  },
);

router.put(
  "/post/:id",
  async (req, res) => {
    const userData = (await authCheck(req)) as string;
    if (userData === undefined) {
      return res
        .status(403)
        .send(ResponseMessage("인증되지 않은 사용자입니다."));
    }

    const id = parseInt(req.params.id, 10);

    const body = await req.json();
    const picture = body.picture as string;
    const content = body.content as string;
    const chips = body.chips as string;

    return await postUpdate(id, userData, content, picture, chips)
      .then(() => {
        return res
          .status(200)
          .send(ResponseMessage("게시글이 수정되었습니다."));
      })
      .catch((err) => {
        if (err.message === "권한이 없습니다.") {
          return res
            .status(403)
            .send(ResponseMessage("해당 글의 주인이 아닙니다."));
        }
        return res
          .status(500)
          .send(
            ResponseMessage("알 수 없는 오류로 게시글이 수정되지 않았습니다."),
          );
      });
  },
  {
    summary: "글 수정 (Auth Required)",
    description: "담벼락 글을 수정합니다. 수정할 글의 id를 path에 넣어주세요.",
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

router.del(
  "/post/:id",
  async (req, res) => {
    const userData = (await authCheck(req)) as string;
    if (userData === undefined) {
      return res
        .status(403)
        .send(ResponseMessage("인증되지 않은 사용자입니다."));
    }

    const id = parseInt(req.params.id, 10);

    return await postDelete(id, userData)
      .then(() => {
        return res
          .status(200)
          .send(ResponseMessage("게시글이 삭제되었습니다."));
      })
      .catch((err) => {
        if (err.message === "권한이 없습니다.") {
          return res
            .status(403)
            .send(ResponseMessage("해당 글의 주인이 아닙니다."));
        }
        return res
          .status(500)
          .send(
            ResponseMessage("알 수 없는 오류로 게시글이 삭제되지 않았습니다."),
          );
      });
  },
  {
    summary: "글 삭제 (Auth Required)",
    description: "담벼락 글을 삭제합니다. 삭제할 글의 id를 path에 넣어주세요.",
  },
);

export { router as postRouter };
