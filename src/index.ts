import { bunAPI } from "bunApi";
import { v1Router } from "@controllers/v1";
import cors from "cors";

const app = bunAPI();

const corsOptions = {
  origin: "*",
  credentials: true,
} as const;

export const run = () => {
  app.use("/api", v1Router);

  app.use(cors(corsOptions));

  app.listen(3000, () => {
    console.info("Server is running on port 3000");
  });
};
