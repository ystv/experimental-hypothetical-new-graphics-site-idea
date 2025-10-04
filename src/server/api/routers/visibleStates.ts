import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { serverGlobals } from "@/server/socket";

export const visibleStatesRouter = createTRPCRouter({
  toggle: publicProcedure
    .input(z.object({ event_id: z.string().cuid(), path: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const current = await ctx.db.visibleState.findFirstOrThrow({
        where: {
          event_id: input.event_id,
          path: input.path,
        },
      });

      await ctx.db.visibleState.update({
        where: {
          event_id_path: {
            event_id: input.event_id,
            path: input.path,
          },
        },
        data: {
          visible: current.visible ? false : true,
        },
      });

      serverGlobals.io.emit(`update:event:${input.event_id}`);

      serverGlobals.io.emit(`update:state:${input.event_id}:${input.path}`, {
        visible: current.visible ? false : true,
      });
    }),

  read: publicProcedure
    .input(z.object({ event_id: z.string().cuid(), path: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.visibleState.findFirst({
        where: {
          event_id: input.event_id,
          path: input.path,
        },
      });
    }),

  show: publicProcedure
    .input(z.object({ event_id: z.string().cuid(), path: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.visibleState.update({
        where: {
          event_id_path: {
            event_id: input.event_id,
            path: input.path,
          },
        },
        data: {
          visible: true,
        },
      });

      serverGlobals.io.emit(`update:event:${input.event_id}`);

      serverGlobals.io.emit(`update:state:${input.event_id}:${input.path}`, {
        visible: true,
      });
    }),

  hide: publicProcedure
    .input(z.object({ event_id: z.string().cuid(), path: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.visibleState.update({
        where: {
          event_id_path: {
            event_id: input.event_id,
            path: input.path,
          },
        },
        data: {
          visible: false,
        },
      });

      serverGlobals.io.emit(`update:event:${input.event_id}`);

      serverGlobals.io.emit(`update:state:${input.event_id}:${input.path}`, {
        visible: false,
      });
    }),
});
