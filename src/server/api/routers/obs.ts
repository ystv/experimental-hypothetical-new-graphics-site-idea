import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { serverGlobals } from "@/server/socket";

export const obsRouter = createTRPCRouter({
  cutSyncer: publicProcedure.mutation(() => {
    serverGlobals.io.emit("obs:cutSyncer");
  }),
});
