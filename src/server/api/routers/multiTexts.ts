import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { schemas } from "../schemas";

export const multiTextsRouter = createTRPCRouter({
  read: publicProcedure
    .input(schemas.multiTexts.read.input)
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.multiText.findFirst({
        where: {
          event_id: input.event_id,
          path: input.path,
        },
        include: {
          multi_text_selected: {
            include: {
              selected_option: true,
            },
          },
        },
      });

      return res?.multi_text_selected?.selected_option ?? "";
    }),
});
