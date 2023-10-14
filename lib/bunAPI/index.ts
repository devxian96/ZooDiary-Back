import { pathToRegexp, type Key } from "path-to-regexp";
import { absolutePath } from "./swagger-ui-dist";
import {
  name as projectName,
  version as projectVersion,
  description as projectDescription,
  author as projectAuthor,
  license as projectLicense,
  repository as projectRepository,
} from "../../package.json";

export interface APIList extends ApiOption {
  path: string;
  apiCallBack: ApiCallBack;
  keys: Key[];
  regexp: RegExp;
}
export interface ApiOption {
  summary: string;
  description: string;
  parameters?: {
    name: string;
    in: "query" | "body";
    description: string;
    required: boolean;
    schema?: {
      type: "string" | "object";
      properties?: Record<string, unknown>;
    };
  }[];
}

export interface RequestWithType extends Request {
  params: Record<string, string>;
  query: URLSearchParams;
}
type RequestWithOmit = Omit<RequestWithType, "body"> & {
  body?: Record<string, unknown>;
};

type ApiCallBack = (
  request: RequestWithOmit,
  response: typeof res,
) => Response | Promise<Response>;
type CallBack = () => void;

const getAPIList: APIList[] = [];
const postAPIList: APIList[] = [];
const putAPIList: APIList[] = [];
const delAPIList: APIList[] = [];

const apiListBook: Record<string, APIList[]> = {
  get: getAPIList,
  post: postAPIList,
  put: putAPIList,
  del: delAPIList,
} as const;

const apiToSwagger = (apiList: APIList[]) => {
  const swaggerAPIList = [];
  for (let i = 0; i < apiList.length; i++) {
    const api = apiList[i];
    const { path, keys } = api;
    const swaggerPath = path.replace(/:(\w+)/g, "{$1}");
    const swaggerKeys = keys.map((key) => {
      return {
        name: key.name,
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      };
    });

    swaggerAPIList.push({
      path: swaggerPath,
      parameters: [...swaggerKeys, ...(api?.parameters ?? [])],
      summary: api.summary,
      description: api.description,
    });
  }
  return swaggerAPIList;
};

const responses = {
  200: { description: "성공적으로 응답함" },
  201: { description: "생성됨" },
  202: { description: "요청을 수행함" },
  400: { description: "필수 파라미터등이 누락된 잘못된 요청" },
  401: { description: "로그인이 필요함" },
  403: { description: "권한이 없음" },
} as const;

const getTag = (path: string) => {
  const split = path.split("/");
  return split[split.length - 2];
};

const listen = (port = 3000, callBack: CallBack) => {
  Bun.serve({
    port,
    async fetch(req: RequestWithType) {
      const { pathname, searchParams } = new URL(req.url);
      const method = req.method.toLowerCase();

      // swagger
      if (method === "get" && pathname === "/api-docs") {
        return new Response(Bun.file(`${absolutePath()}/index.html`), {
          status: 200,
        });
      }
      if (method === "get" && pathname === "/openapi.json") {
        // build swagger json
        const swaggerJson = {
          openapi: "3.0.0",
          info: {
            title: projectName,
            version: projectVersion,
            description: projectDescription,
            contact: {
              name: projectAuthor.name,
              email: projectAuthor.email,
            },
            license: {
              name: `${projectLicense} License`,
            },
            termsOfService: projectRepository,
          },
          servers: [
            {
              url: `http://localhost:${port}`,
            },
          ],
          host: `localhost:${port}`,
          paths: {} as Record<string, unknown>,
        };

        apiToSwagger(getAPIList).forEach((api) => {
          swaggerJson.paths[api.path] = {
            get: {
              tags: [getTag(api.path)],
              summary: api.summary,
              parameters: api.parameters,
              description: api.description,
              responses,
            },
          };
        });

        apiToSwagger(postAPIList).forEach((api) => {
          swaggerJson.paths[api.path] = {
            post: {
              tags: [getTag(api.path)],
              summary: api.summary,
              description: api.description,
              parameters: api.parameters,
              responses,
            },
          };
        });

        apiToSwagger(putAPIList).forEach((api) => {
          swaggerJson.paths[api.path] = {
            put: {
              tags: [getTag(api.path)],
              summary: api.summary,
              description: api.description,
              parameters: api.parameters,
              responses,
            },
          };
        });

        apiToSwagger(delAPIList).forEach((api) => {
          swaggerJson.paths[api.path] = {
            delete: {
              tags: [getTag(api.path)],
              summary: api.summary,
              description: api.description,
              parameters: api.parameters,
              responses,
            },
          };
        });

        return new Response(JSON.stringify(swaggerJson), { status: 200 });
      }

      for (let i = 0; i < staticList.length; i++) {
        const file = Bun.file(`${staticList[i]}${pathname}`);
        if (await file.exists()) {
          return new Response(file, { status: 200 });
        }
      }

      const apiList = apiListBook[method as keyof typeof apiListBook];
      if (apiList.length === 0) return new Response(undefined, { status: 405 }); // Method Not Allowed

      const api = apiList.find((api) => api.regexp.test(pathname));

      if (api) {
        const { apiCallBack, regexp, keys } = api;
        const match = regexp.exec(pathname);
        const params: Record<string, string> = {};

        if (match) {
          match.slice(1).forEach((value, index) => {
            const key = keys[index];
            params[key.name] = value;
          });
        }

        req.params = params;
        req.query = searchParams;
        try {
          return apiCallBack(
            { ...req, body: await req.json() } as RequestWithOmit,
            res,
          );
        } catch {
          return apiCallBack({ ...req } as RequestWithOmit, res);
        }
      }

      return new Response(undefined, { status: 404 }); // Not Found
    },
  });

  serveStatic(absolutePath());
  callBack();
};

const res = {
  statusCode: null as number | null,
  send(data: ResponseData) {
    if (data && typeof data === "object") {
      const buff = Buffer.from(JSON.stringify(data));
      const compressed = Bun.gzipSync(buff);
      return new Response(compressed, {
        status: this.statusCode ?? 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Encoding": "gzip",
        },
      });
    }

    const buff = Buffer.from(data);
    const compressed = Bun.gzipSync(buff);
    return new Response(compressed, {
      status: this.statusCode ?? 200,
      headers: {
        "Content-type": "text/html; charset=utf-8",
        "Content-Encoding": "gzip",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
  status(status: number) {
    this.statusCode = status;
    return this;
  },
};

type ResponseData =
  | string
  | Blob
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | Record<string, unknown>;

const addRoute = (
  path: string,
  apiCallBack: ApiCallBack,
  apiList: APIList[],
  option: ApiOption,
) => {
  const keys: Key[] = [];
  const regexp = pathToRegexp(path, keys);
  apiList.push({
    path,
    apiCallBack,
    keys,
    regexp,
    description: option.description,
    summary: option.summary,
    parameters: option.parameters,
  });
};

const get = (path: string, apiCallBack: ApiCallBack, option: ApiOption) => {
  getAPIList.forEach((api) => {
    if (api.path === path) {
      throw new Error(`get ${path} already exists`);
    }
  });
  addRoute(path, apiCallBack, getAPIList, option);
};

const post = (path: string, apiCallBack: ApiCallBack, option: ApiOption) => {
  postAPIList.forEach((api) => {
    if (api.path === path) {
      throw new Error(`post ${path} already exists`);
    }
  });
  addRoute(path, apiCallBack, postAPIList, option);
};

const put = (path: string, apiCallBack: ApiCallBack, option: ApiOption) => {
  putAPIList.forEach((api) => {
    if (api.path === path) {
      throw new Error(`put ${path} already exists`);
    }
  });
  addRoute(path, apiCallBack, putAPIList, option);
};

const del = (path: string, apiCallBack: ApiCallBack, option: ApiOption) => {
  delAPIList.forEach((api) => {
    if (api.path === path) {
      throw new Error(`del ${path} already exists`);
    }
  });
  addRoute(path, apiCallBack, delAPIList, option);
};

export interface RouterGroup {
  getAPIList: APIList[];
  postAPIList: APIList[];
  putAPIList: APIList[];
  delAPIList: APIList[];
  get: (path: string, apiCallBack: ApiCallBack, option: ApiOption) => void;
  post: (path: string, apiCallBack: ApiCallBack, option: ApiOption) => void;
  put: (path: string, apiCallBack: ApiCallBack, option: ApiOption) => void;
  del: (path: string, apiCallBack: ApiCallBack, option: ApiOption) => void;
  group: (path: string, callBack: (router: RouterGroup) => void) => void;
  use: {
    (path: string, router: RouterGroup): void;
    (router: RouterGroup): void;
  };
}
export const group = (
  groupPath: string,
  callBack: (router: RouterGroup) => void,
) => {
  const newRouter = Router();
  callBack(newRouter);
  use(groupPath, newRouter);
};

const staticList: string[] = [];
const serveStatic = (path: string) => {
  staticList.forEach((staticPath) => {
    if (staticPath === path) {
      throw new Error(`static ${path} already exists`);
    }
  });
  staticList.push(path);
};

export const Router = () => {
  return {
    get,
    post,
    put,
    del,
    group,
    serveStatic,
    use,
    getAPIList,
    postAPIList,
    putAPIList,
    delAPIList,
  };
};

// Define the possible function overloads
export function use(path: string, router: RouterGroup): void;
export function use(router: RouterGroup): void;

// Implement the function
export function use(
  pathOrRouter: string | RouterGroup,
  router?: RouterGroup,
): void {
  let path: string;

  if (typeof pathOrRouter === "string") {
    path = pathOrRouter;
    if (!router) {
      throw new Error("Router must be provided when a path is given.");
    }
  } else {
    router = pathOrRouter;
    path = "";
  }

  const {
    getAPIList: childGetAPIList,
    postAPIList: childPostAPIList,
    putAPIList: childPutAPIList,
    delAPIList: childDelAPIList,
  } = router;

  const updateApiList = (apiList: APIList[]): APIList[] => {
    return apiList.map((api) => {
      const newPath = `${path}${api.path}`;
      const keys: Key[] = [];
      const regexp = pathToRegexp(newPath, keys);
      return {
        ...api,
        path: newPath,
        keys,
        regexp,
      };
    });
  };

  getAPIList.splice(0, getAPIList.length, ...updateApiList(childGetAPIList));
  postAPIList.splice(0, postAPIList.length, ...updateApiList(childPostAPIList));
  putAPIList.splice(0, putAPIList.length, ...updateApiList(childPutAPIList));
  delAPIList.splice(0, delAPIList.length, ...updateApiList(childDelAPIList));
}

export const bunAPI = () => {
  return {
    get,
    post,
    put,
    del,
    group,
    listen,
    serveStatic,
    Router,
    use,
  };
};

export default bunAPI;
