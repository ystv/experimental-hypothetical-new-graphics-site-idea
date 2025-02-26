import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { io, serverGlobals } from "@/server/socket";
import { Server } from "socket.io";

export const ydcOutputRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.yDCOutput.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.yDCOutput.create({});

    serverGlobals.io.in("authenticatedUsers").emit("update:ydc:outputs");
  }),

  updateOutput: protectedProcedure
    .input(
      z.object({
        output_id: z.number(),
        section_id: z.string().optional(),
        team_id: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.yDCOutput.update({
        where: {
          id: input.output_id,
        },
        data: {
          section: input.section_id
            ? {
                connect: { id: input.section_id },
              }
            : {},
          team: input.team_id
            ? {
                connect: { id: input.team_id },
              }
            : {},
        },
      });

      serverGlobals.io.emit(`update:ydc:output:${input.output_id}`);
    }),

  getCurrent: publicProcedure
    .input(z.object({ output_id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.yDCOutput.findFirst({
        where: {
          id: input.output_id,
        },
        select: {
          section: true,
          team: true,
        },
      });
    }),
});
