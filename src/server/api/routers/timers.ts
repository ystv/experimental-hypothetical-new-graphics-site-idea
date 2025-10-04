import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { serverGlobals } from "@/server/socket";
import { schemas } from "../schemas";

export const timersRouter = createTRPCRouter({
  read: publicProcedure
    .input(schemas.timers.read.input)
    .query(({ ctx, input }) => {
      return ctx.db.timer.findFirst({
        where: {
          event_id: input.event_id,
          path: input.path,
        },
      });
    }),

  start: protectedProcedure
    .input(schemas.timers.start.input)
    .mutation(async ({ ctx, input }) => {
      const timer = await ctx.db.timer.findUniqueOrThrow({
        where: {
          event_id_path: {
            event_id: input.event_id,
            path: input.path,
          },
        },
      });

      if (timer.paused === false) return;

      await ctx.db.timer.update({
        where: {
          event_id_path: {
            event_id: input.event_id,
            path: input.path,
          },
        },
        data: {
          paused: false,
          paused_at_seconds: null,
          ends_at: new Date(
            Date.now() +
              (timer.paused_at_seconds ?? timer.duration_seconds) * 1000,
          ),
        },
      });

      serverGlobals.io.emit(`update:timer:${input.event_id}:${input.path}`);

      return;
    }),

  pause: protectedProcedure
    .input(schemas.timers.pause.input)
    .mutation(async ({ ctx, input }) => {
      const timer = await ctx.db.timer.findUniqueOrThrow({
        where: {
          event_id_path: {
            event_id: input.event_id,
            path: input.path,
          },
        },
      });

      if (timer.paused === true) return;

      const secondsRemaining = Math.round(
        (timer.ends_at.getTime() - Date.now()) / 1000,
      );

      await ctx.db.timer.update({
        where: {
          event_id_path: {
            event_id: input.event_id,
            path: input.path,
          },
        },
        data: {
          paused: true,
          paused_at_seconds: secondsRemaining > 0 ? secondsRemaining : 0,
          ends_at: new Date(),
        },
      });

      serverGlobals.io.emit(`update:timer:${input.event_id}:${input.path}`);

      return;
    }),

  reset: protectedProcedure
    .input(schemas.timers.reset.input)
    .mutation(async ({ ctx, input }) => {
      const timer = await ctx.db.timer.findUniqueOrThrow({
        where: {
          event_id_path: {
            event_id: input.event_id,
            path: input.path,
          },
        },
      });

      await ctx.db.timer.update({
        where: {
          event_id_path: {
            event_id: input.event_id,
            path: input.path,
          },
        },
        data: {
          paused: true,
          paused_at_seconds: timer.duration_seconds,
          ends_at: new Date(),
        },
      });

      serverGlobals.io.emit(`update:timer:${input.event_id}:${input.path}`);

      return;
    }),
});
