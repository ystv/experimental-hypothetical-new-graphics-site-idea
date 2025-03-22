import { z } from "zod";

const create = {
  input: z.object({
    name: z.string().min(1),
    event_type_id: z.string().cuid(),
  }),
};

export const eventsSchema = {
  create,
};
