import express from "express";
import next from "next";
import { startGraphQLServer } from "./apollo-server";
import schema from "./graphql/schema";

const { PORT = "3000" } = process.env;
const app = next({ dev: !process.env.NODE_ENV });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();

  const server = express();

  await startGraphQLServer(server, schema);

  server.all("*", (req, res) => handle(req, res));
  server.listen(PORT, () => console.info(`Application started on ${PORT}`));
})();
