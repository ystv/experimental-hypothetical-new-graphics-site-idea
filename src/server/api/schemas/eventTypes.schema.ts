import { z } from "zod";

const create = {
  input: z.object({ name: z.string().min(1) }),
};

export const eventTypesSchema = {
  create,
};
