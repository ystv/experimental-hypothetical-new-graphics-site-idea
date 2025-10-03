import { z } from "zod";

const read = {
  input: z.object({
    event_id: z.string().cuid(),
    path: z.string(),
  }),
};

export const multiTextsSchema = {
  read,
};
