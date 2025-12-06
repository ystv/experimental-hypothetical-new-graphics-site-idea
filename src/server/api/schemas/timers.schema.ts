import { z } from "zod";

const read = {
  input: z.object({
    event_id: z.string().cuid(),
    path: z.string(),
  }),
};

const start = {
  input: z.object({
    event_id: z.string().cuid(),
    path: z.string(),
  }),
};

const pause = {
  input: z.object({
    event_id: z.string().cuid(),
    path: z.string(),
  }),
};

const reset = {
  input: z.object({
    event_id: z.string().cuid(),
    path: z.string(),
    duration_seconds: z.number().optional(),
  }),
};

export const timersSchema = {
  read,
  start,
  pause,
  reset,
};
