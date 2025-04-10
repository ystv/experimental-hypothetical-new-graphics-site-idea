import { Prisma } from "@prisma/client";
import { db } from "../src/server/db";
import { exit } from "process";
import {
  createServer as createHttpServer,
  Server as HttpServer,
} from "node:http";
import { readFileSync } from "fs";
import { RequestHandler } from "next/dist/server/next";

export async function checkDatabaseConnection() {
  return new Promise<void>(async (resolve, reject) => {
    let connectionAttempts = 1;

    while (connectionAttempts <= 3) {
      try {
        await db.$executeRaw(Prisma.sql`SELECT 1;`);
        return resolve();
      } catch (e) {
        console.error(
          `Database connection attempt ${connectionAttempts} failed, retrying...`,
        );
        await sleep(5000);
      }
      connectionAttempts += 1;
    }
    if (connectionAttempts > 3) {
      console.error(
        "Connection to database failed, exiting. Please check your configuration.",
      );
      exit(1);
    }
  });
}

export async function prepareHttpServer(
  handler: RequestHandler,
): Promise<HttpServer> {
  let httpServer: HttpServer;

  httpServer = createHttpServer(handler);

  return httpServer;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
