import next from "next";
import { Server } from "socket.io";
import { authenticateSocket } from "./auth";
import { env } from "../src/env.js";
import { checkDatabaseConnection, prepareHttpServer } from "./lib";
import { z } from "zod";

const dev = env.NODE_ENV !== "production";
const hostname = "localhost";
const port = z.number().default(3000).parse(env.PORT);
// when using middleware `hostname` and `port` must be provided below
const app = next({
  dev,
  hostname,
  port: port,
});
const handler = app.getRequestHandler();

let io: Server;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.prepare().then(async () => {
  const httpServer = await prepareHttpServer(handler);

  await checkDatabaseConnection();

  io = new Server(httpServer);
  (globalThis as unknown as { io: Server }).io = io;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  io.use(authenticateSocket);

  io.on("connection", async (socket) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (socket.data.auth.invalidSession === true) {
      socket.emit("invalidSession");
    }
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
