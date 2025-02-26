import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
// import { io } from "@/server/socket";
import { serverGlobals } from "@/server/socket";

export const ydcTeamRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const teams = await ctx.db.yDCTeam.findMany({});

    return teams;
  }),

  create: protectedProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.yDCTeam.create({
        data: {
          name: input.text,
        },
      });

      serverGlobals.io.in("authenticatedUsers").emit(`update:ydc:teams`);
    }),

  delete: protectedProcedure
    .input(z.object({ team_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.yDCTeam.delete({
        where: {
          id: input.team_id,
        },
      });

      serverGlobals.io.in("authenticatedUsers").emit(`update:ydc:teams`);
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
