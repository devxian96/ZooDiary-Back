import { bunAPI } from "bunApi";
import { v1Router } from "./controllers";

const app = bunAPI();

export const run = () => {
  app.use("/api", v1Router);

  app.listen(3000, () => {
    console.info("Server is running on port 3000");
  });
};
