import { type Server } from "socket.io";

export const serverGlobals = globalThis as unknown as { io: Server };

export const io = serverGlobals.io;
