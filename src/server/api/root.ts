import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { eventsRouter } from "./routers/events";
import { eventTypesRouter } from "./routers/eventTypes";
import { fullscreenRouter } from "./routers/fullscreen";
import { mtOptionsRouter } from "./routers/mtOptions";
import { multiTextsRouter } from "./routers/multiTexts";
import { obsRouter } from "./routers/obs";
import { outputRouter } from "./routers/output";
import { questionRouter } from "./routers/question";
import { timersRouter } from "./routers/timers";
import { visibleStatesRouter } from "./routers/visibleStates";
import { ydcRouter } from "./routers/ydc";
import { societiesRouter } from "./routers/societies";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  events: eventsRouter,
  eventTypes: eventTypesRouter,
  fullscreen: fullscreenRouter,
  mtOptions: mtOptionsRouter,
  multiTexts: multiTextsRouter,
  obs: obsRouter,
  output: outputRouter,
  question: questionRouter,
  societies: societiesRouter,
  timers: timersRouter,
  visibleState: visibleStatesRouter,
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
