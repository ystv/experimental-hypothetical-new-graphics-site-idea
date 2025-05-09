import { z } from "zod";

const create = {
  input: z.object({
    multi_text_id: z.string().cuid(),
    content: z.string().min(1),
  }),
};

const update = {
  input: z.object({
    multi_text_option_id: z.string().cuid(),
    content: z.string().min(1),
  }),
};

export const mtOptionsSchema = {
  create,
  update,
};
