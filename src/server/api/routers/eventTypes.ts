import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { serverGlobals } from "@/server/socket";
import { schemas } from "../schemas";

export const eventTypesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schemas.eventTypes.create.input)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.eventType.create({
        data: {
          name: input.name,
          multi_text_skeleton: input.multi_text_skeleton,
          timer_skeleton: input.timer_skeleton,
          visible_state_skeleton: input.visible_state_skeleton,
          society_skeleton: input.society_skeleton,
        },
      });

      serverGlobals.io.emit("update:eventTypes");
    }),

  readOne: publicProcedure
    .input(z.object({ event_type_id: z.string() }))
    .query(({ ctx, input }) => {
      try {
        return ctx.db.eventType.findUniqueOrThrow({
          where: {
            id: input.event_type_id,
          },
        });
      } catch (_e) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
    }),

  readMany: publicProcedure.query(({ ctx }) => {
    return ctx.db.eventType.findMany({
      orderBy: {
        updated_at: "desc",
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ event_type_id: z.string(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.eventType.update({
        where: {
          id: input.event_type_id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
