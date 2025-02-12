import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { io } from "@/server/socket";

export const outputRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.output.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.output.create({});

    io.in("authenticatedUsers").emit("update:outputs");
  }),

  selectQuestion: protectedProcedure
    .input(z.object({ output_id: z.number(), question_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.questionOutput.upsert({
        where: {
          output_id: input.output_id,
        },
        create: {
          output: {
            connect: { id: input.output_id },
          },
          question: {
            connect: { id: input.question_id },
          },
        },
        update: {
          question: {
            connect: { id: input.question_id },
          },
        },
      });

      io.in("authenticatedUsers").emit(`update:output:${input.output_id}`);
    }),

  getCurrent: publicProcedure
    .input(z.object({ output_id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.question.findFirst({
        where: {
          QuestionOutput: {
            output_id: input.output_id,
          },
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
