import { db } from "../src/server/db";
import { z } from "zod";
import { ExtendedError } from "socket.io";
import { env } from "../src/env";
import { Socket } from "socket.io";

export async function authenticateSocket(
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) {
  if (Object.hasOwn(socket.data, "auth")) {
    return next();
  }

  const cookie = parseCookie(socket.client.request.headers.cookie);

  const sessionCookie: string | undefined =
    cookie["__Secure-authjs.session-token"];

  if (sessionCookie) {
    var decodedSession: unknown;

    try {
      decodedSession = await await db.session.findFirstOrThrow({
        where: {
          sessionToken: sessionCookie,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      socket.data.auth = { invalidSession: true };
      return next();
    }

    const session = z
      .object({
        user: z.object({ id: z.string() }),
      })
      .parse(decodedSession);

    const user = session.user;

    if (user !== null) {
      socket.data.auth = {
        authenticated: true,
        isClient: true,
        user: user,
      };

      socket.join(`userOnly:id:${user.id}`);
      socket.join(`authenticatedUsers`);
      return next();
    } else {
      socket.data.auth = {
        authenticated: false,
      };
      return next();
    }
  } else {
    socket.data.auth = {
      authenticated: false,
    };
    return next();
  }

  return next();
}

export function parseCookie(cookie: string | undefined) {
  if (cookie == undefined) return {};
  return cookie
    .split(";")
    .map((value) => value.split("="))
    .reduce((acc: any, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}

export function isServerSocket(socket: Socket) {
  return (
    socket.data.auth.authenticated == true && socket.data.auth.isClient == false
  );
}
