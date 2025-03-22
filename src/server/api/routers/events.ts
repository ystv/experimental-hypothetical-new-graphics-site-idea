import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { serverGlobals } from "@/server/socket";
import { EventType } from "@prisma/client";

export const eventsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({ event_type_id: z.string().cuid(), name: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      let eventType: EventType;

      try {
        eventType = await ctx.db.eventType.findUniqueOrThrow({
          where: {
            id: input.event_type_id,
          },
        });
      } catch (_e) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const event = await ctx.db.event.create({
        data: {
          name: input.name,
          type: {
            connect: { id: eventType.id },
          },
        },
      });

      for (const multi_text_skel of eventType.multi_text_skeleton) {
        const skelRes = await ctx.db.multiText.create({
          data: {
            event: { connect: { id: event.id } },
            path: multi_text_skel.path,
            name: multi_text_skel.name,
          },
        });

        for (const skel_opt of multi_text_skel.default_options ?? []) {
          await ctx.db.multiTextOption.create({
            data: {
              multi_text: { connect: { id: skelRes.id } },
              content: skel_opt,
            },
          });
        }
      }

      serverGlobals.io.emit("update:events");
    }),

  readOne: publicProcedure
    .input(z.object({ event_id: z.string() }))
    .query(({ ctx, input }) => {
      try {
        return ctx.db.event.findUniqueOrThrow({
          where: {
            id: input.event_id,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
    }),

  // TODO Pagination
  readMany: publicProcedure.query(({ ctx }) => {
    return ctx.db.event.findMany({
      orderBy: {
        updated_at: "desc",
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ event_id: z.string(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.event.update({
        where: {
          id: input.event_id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  getPublicState: publicProcedure
    .input(z.object({ event_id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findUnique({
        where: {
          id: input.event_id,
        },
        include: {
          multi_texts: {
            include: {
              multi_text_selected: {
                include: {
                  selected_option: true,
                },
              },
            },
          },
        },
      });
    }),

  getPrivateState: publicProcedure
    .input(z.object({ event_id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findUnique({
        where: {
          id: input.event_id,
        },
        include: {
          multi_texts: {
            include: {
              multi_text_selected: {
                include: {
                  selected_option: true,
                },
              },
              options: true,
            },
          },
        },
      });
    }),
});
