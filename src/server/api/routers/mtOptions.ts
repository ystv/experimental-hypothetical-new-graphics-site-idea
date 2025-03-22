import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { serverGlobals } from "@/server/socket";
import { schemas } from "../schemas";

export const mtOptionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schemas.mtOptions.create.input)
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.multiTextOption.create({
        data: {
          content: input.content,
          multi_text: {
            connect: { id: input.multi_text_id },
          },
        },
        include: {
          multi_text: {
            select: {
              event: true,
            },
          },
        },
      });

      serverGlobals.io.emit(`update:event:${res.multi_text.event.id}`);
    }),

  select: protectedProcedure
    .input(
      z.object({
        multi_text_id: z.string().cuid(),
        option_id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.multiTextSelected.upsert({
        create: {
          multi_text_id: input.multi_text_id,
          selected_option_id: input.option_id,
        },
        update: {
          multi_text_id: input.multi_text_id,
          selected_option_id: input.option_id,
        },
        where: {
          multi_text_id: input.multi_text_id,
        },
        select: {
          multi_text: {
            select: {
              event: true,
            },
          },
        },
      });

      serverGlobals.io.emit(`update:event:${res.multi_text.event.id}`);
    }),
});
