import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { fullscreenRouter } from "./routers/fullscreen";
import { questionRouter } from "./routers/question";
import { outputRouter } from "./routers/output";
import { ydcRouter } from "./routers/ydc";
import { obsRouter } from "./routers/obs";
import { eventTypesRouter } from "./routers/eventTypes";
import { eventsRouter } from "./routers/events";
import { mtOptionsRouter } from "./routers/mtOptions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  eventTypes: eventTypesRouter,
  events: eventsRouter,
  fullscreen: fullscreenRouter,
  mtOptions: mtOptionsRouter,
  question: questionRouter,
  obs: obsRouter,
  output: outputRouter,
  ydc: ydcRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
