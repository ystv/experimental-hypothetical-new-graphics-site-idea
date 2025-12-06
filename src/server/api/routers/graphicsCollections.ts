import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { schemas } from "../schemas";

export const graphicsCollectionsRouter = createTRPCRouter({
  getPublicState: publicProcedure
    .input(schemas.graphicsCollections.getPublicState.input)
    .query(async ({ ctx, input }) => {
      const graphicsCollection =
        await ctx.db.eventGraphicsCollection.findFirstOrThrow({
          where: {
            id: input.graphics_collection_id,
          },
        });

      return graphicsCollection;
    }),
});
