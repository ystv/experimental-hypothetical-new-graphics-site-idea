import { GraphicsCollections } from "@/lib/graphics";
import { z } from "zod";

const ZGraphicsColectionMappedPath = z.object({
  name: z.string(),
  mapped_path: z.string().min(1),
});

const create = {
  input: z.object({
    name: z.string().min(1),
    collections: z.array(
      z.object({
        collectionSlug: z.custom<keyof typeof GraphicsCollections>((v) =>
          Object.hasOwn(GraphicsCollections, v as string)
            ? (v as keyof typeof GraphicsCollections)
            : false,
        ),
        mapping: z.object({
          multi_texts: z.optional(
            z.record(z.string(), ZGraphicsColectionMappedPath),
          ),
          timers: z.optional(
            z.record(z.string(), ZGraphicsColectionMappedPath),
          ),
          visible_states: z.optional(
            z.record(z.string(), ZGraphicsColectionMappedPath),
          ),
          societies: z.optional(
            z.record(z.string(), ZGraphicsColectionMappedPath),
          ),
        }),
      }),
    ),
  }),
};

export const eventsSchema = {
  create,
};
