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

export const eventsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schemas.events.create.input)
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.create({
        data: {
          name: input.name,
        },
      });

      const multiTexts = new Set<string>();
      const timers = new Set<string>();
      const visibileStates = new Set<string>();
      const societies = new Set<string>();

      for (const inputCollection of input.collections) {
        await ctx.db.eventGraphicsCollection.create({
          data: {
            collection_slug: inputCollection.collectionSlug,
            event: { connect: { id: event.id } },
            path_mapping: inputCollection.mapping,
          },
        });

        flattenRecord(inputCollection.mapping.multi_texts).map((mt) => {
          multiTexts.add(mt.key);
        });
        flattenRecord(inputCollection.mapping.timers).map((timer) => {
          timers.add(timer.key);
        });
        flattenRecord(inputCollection.mapping.visible_states).map((vs) => {
          visibileStates.add(vs.key);
        });
        flattenRecord(inputCollection.mapping.societies).map((soc) => {
          societies.add(soc.key);
        });
      }

      for (const mtPath of multiTexts) {
        await ctx.db.multiText.create({
          data: {
            event: { connect: { id: event.id } },
            path: mtPath,
          },
        });
      }

      for (const tmPath of timers) {
        await ctx.db.timer.create({
          data: {
            event: { connect: { id: event.id } },
            path: tmPath,
            duration_seconds: 60,
            ends_at: new Date(Date.now() + 60000),
            paused: true,
            paused_at_seconds: 60,
          },
        });
      }

      for (const vsPath of visibileStates) {
        await ctx.db.visibleState.create({
          data: {
            event: { connect: { id: event.id } },
            path: vsPath,
            visible: false,
          },
        });
      }

      for (const socPath of societies) {
        await ctx.db.society.create({
          data: {
            event: { connect: { id: event.id } },
            path: socPath,
          },
        });
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
      } catch (_e) {
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
          timers: true,
          visible_states: true,
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
          graphics_collections: true,
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
          timers: true,
          visible_states: true,
          societies: true,
          active_cue: true,
          cues: true,
        },
      });
    }),
});
