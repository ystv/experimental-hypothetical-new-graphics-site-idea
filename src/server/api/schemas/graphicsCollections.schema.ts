import { z } from "zod";

const getPublicState = {
  input: z.object({
    graphics_collection_id: z.string(),
  }),
};

export const graphicsCollectionsSchema = {
  getPublicState,
};
