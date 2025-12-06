import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { serverGlobals } from "@/server/socket";
import { type EventType } from "@prisma/client";
import { schemas } from "../schemas";
import {
  GraphicsCollections,
  TGraphicsCollection,
  TGraphicsCollectionPath,
  flattenRecord,
} from "@/lib/graphics";

export const cuesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schemas.events.create.input)
    .mutation(async ({ ctx, input }) => {
      serverGlobals.io.emit("update:events");
    }),
});
