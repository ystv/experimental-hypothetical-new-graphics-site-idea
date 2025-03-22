import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { serverGlobals } from "@/server/socket";

export const questionRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ output_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const questions = await ctx.db.question.findMany({
        where: {
          output_id: input.output_id,
        },
        orderBy: {
          order: "asc",
        },
      });

      return questions;
    }),

  create: protectedProcedure
    .input(z.object({ output_id: z.number(), text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const dbOutputMaxOrder = await ctx.db.question.findFirst({
        where: {
          output_id: input.output_id,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });

      const nextOrder =
        dbOutputMaxOrder !== null ? dbOutputMaxOrder.order + 1 : 0;

      await ctx.db.question.create({
        data: {
          order: nextOrder,
          text: input.text,
          output: {
            connect: { id: input.output_id },
          },
        },
      });

      serverGlobals.io
        .in("authenticatedUsers")
        .emit(`update:questions:${input.output_id}`);
    }),

  delete: protectedProcedure
    .input(z.object({ output_id: z.number(), question_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedQuestion = await ctx.db.question.delete({
        where: {
          id: input.question_id,
          output_id: input.output_id,
        },
      });

      await ctx.db.question.updateMany({
        where: {
          output_id: deletedQuestion.output_id,
          order: {
            gt: deletedQuestion.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });

      serverGlobals.io
        .in("authenticatedUsers")
        .emit(`update:questions:${input.output_id}`);
      serverGlobals.io
        .in("authenticatedUsers")
        .emit(`update:output:${input.output_id}`);
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
