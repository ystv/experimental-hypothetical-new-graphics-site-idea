import { z } from "zod";

const create = {
  input: z.object({
    name: z.string().min(1),
    multi_text_skeleton: z.array(
      z.object({ name: z.string().min(1), path: z.string().min(1) }),
    ),
    timer_skeleton: z.array(
      z.object({ name: z.string().min(1), path: z.string().min(1) }),
    ),
    visible_state_skeleton: z.array(
      z.object({ name: z.string().min(1), path: z.string().min(1) }),
    ),
    society_skeleton: z.array(
      z.object({ name: z.string().min(1), path: z.string().min(1) }),
    ),
  }),
};

export const eventTypesSchema = {
  create,
};
