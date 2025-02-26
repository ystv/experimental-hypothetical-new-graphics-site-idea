import { db } from "../src/server/db";
import { z } from "zod";
import { type ExtendedError } from "socket.io";
import { type Socket } from "socket.io";

export async function authenticateSocket(
  socket: Socket,
  next: (err?: ExtendedError) => void,
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (Object.hasOwn(socket.data, "auth")) {
    return next();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const cookie = parseCookie(socket.client.request.headers.cookie);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const sessionCookie: string | undefined =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    cookie["__Secure-authjs.session-token"];

  if (sessionCookie) {
    let decodedSession: unknown;

    try {
      decodedSession = await db.session.findFirstOrThrow({
        where: {
          sessionToken: sessionCookie,
        },
        include: {
          user: true,
        },
      });
    } catch (_error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      socket.data.auth = {
        authenticated: true,
        isClient: true,
        user: user,
      };

      await socket.join(`userOnly:id:${user.id}`);
      await socket.join(`authenticatedUsers`);
      return next();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      socket.data.auth = {
        authenticated: false,
      };
      return next();
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    socket.data.auth = {
      authenticated: false,
    };
    return next();
  }

  return next();
}

export function parseCookie(cookie: string | undefined) {
  if (cookie == undefined) return {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    cookie
      .split(";")
      .map((value) => value.split("="))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: any, v) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        acc[decodeURIComponent(v[0]!.trim())] = decodeURIComponent(
          v[1]!.trim(),
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return acc;
      }, {})
  );
}
