import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
// import { io } from "@/server/socket";
import { serverGlobals } from "@/server/socket";

export const ydcSectionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const sections = await ctx.db.yDCSection.findMany({});

    return sections;
  }),

  create: protectedProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.yDCSection.create({
        data: {
          name: input.text,
        },
      });

      serverGlobals.io.in("authenticatedUsers").emit(`update:ydc:sections`);
    }),

  delete: protectedProcedure
    .input(z.object({ section_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.yDCSection.delete({
        where: {
          id: input.section_id,
        },
      });

      serverGlobals.io.in("authenticatedUsers").emit(`update:ydc:sections`);
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
