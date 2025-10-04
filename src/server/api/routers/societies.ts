import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { schemas } from "../schemas";
import { serverGlobals } from "@/server/socket";

const headers = {
  "User-Agent": "YSTV Graphics Site/1.0 (computing@ystv.co.uk)",
  Accept: "application/json, text/plain, */*",
  Pragma: "no-cache",
  "X-Site-Id": "tZyLG9BX9f4hdTp2HLva5c",
  "Cache-Control": "no-cache",
};

export const societiesRouter = createTRPCRouter({
  list: publicProcedure
    .input(schemas.societies.list.input)
    .output(schemas.societies.list.output)
    .query(async ({ input }) => {
      const res = await fetch(
        `https://pluto.sums.su/api/groups?sortBy=name&perPage=${input.perPage}&page=${input.page}&categoryIds=1,2,3,4,5,6,7,8,9,10,11,12,14,27${input.searchTerm ? "&searchTerm=" + encodeURIComponent(input.searchTerm ?? "") : ""}`,
        {
          credentials: "omit",
          headers,
          method: "GET",
        },
      );

      const resJson = schemas.societies.list.output.safeParse(await res.json());

      if (!resJson.success) {
        throw new Error("Failed to fetch societies");
      }

      return resJson.data;
    }),

  read: publicProcedure
    .input(schemas.societies.read.input)
    .output(schemas.societies.read.output)
    .query(async ({ input }) => {
      const res = await getSingleSocietyData(input.group_id);

      return res;
    }),

  readPath: publicProcedure
    .input(schemas.societies.readPath.input)
    .output(schemas.societies.readPath.output)
    .query(async ({ input, ctx }) => {
      const dbSociety = await ctx.db.society.findUniqueOrThrow({
        where: {
          event_id_path: { event_id: input.event_id, path: input.path },
        },
      });

      if (!dbSociety?.society_selected) return { dbSociety, societyData: null };

      const societyData = dbSociety
        ? await getSingleSocietyData(dbSociety.society_selected)
        : null;

      return {
        dbSociety,
        societyData: societyData,
      };
    }),

  select: protectedProcedure
    .input(schemas.societies.select.input)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.society.update({
        where: {
          event_id_path: { event_id: input.event_id, path: input.path },
        },
        data: {
          society_selected: input.group_id,
        },
      });

      serverGlobals.io.emit(`update:society:${input.event_id}:${input.path}`);
    }),
});

async function getSingleSocietyData(group_id: number) {
  const res = await fetch(`https://pluto.sums.su/api/groups/${group_id}`, {
    credentials: "omit",
    headers,
    method: "GET",
  });

  return { ...schemas.societies.read.output.parse(await res.json()), group_id };
}
