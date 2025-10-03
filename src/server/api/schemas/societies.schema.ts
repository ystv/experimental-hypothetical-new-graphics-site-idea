import { output } from "next.config.build";
import { z } from "zod";

const list = {
  input: z.object({
    perPage: z.number().default(24),
    page: z.number().default(1),
    searchTerm: z.string().optional(),
  }),
  output: z.object({
    current_page: z.number(),
    data: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        thumbnail_url: z.string().nullable(),
        header_image_url: z.string().url().nullable(),
        activity_category_id: z.number(),
        url_name: z.string(),
        badges: z.array(z.object({})),
      }),
    ),
    first_page_url: z.string().url(),
    from: z.number(),
    next_page_url: z.string().url().optional().nullable(),
    path: z.string().url(),
    per_page: z.custom<string | number>(),
    prev_page_url: z.string().url().optional().nullable(),
    to: z.number(),
  }),
};

const read = {
  input: z.object({ group_id: z.number() }),
  output: z.object({
    name: z.string().optional(),
    thumbnail_url: z.string().nullable(),
    instagram: z.string(),
    email_address: z.string(),
    url_name: z.string(),
  }),
};

const readPath = {
  input: z.object({ event_id: z.string(), path: z.string() }),
  output: z.object({
    dbSociety: z.object({
      path: z.string(),
      name: z.string().nullable(),
      id: z.string(),
      event_id: z.string(),
      society_selected: z.number().nullable(),
    }),
    societyData: z
      .object({
        group_id: z.number(),
        thumbnail_url: z.string().nullable(),
        url_name: z.string(),
        instagram: z.string().nullable(),
        email_address: z.string(),
        name: z.string().optional(),
      })
      .nullable(),
  }),
};

const select = {
  input: z.object({
    event_id: z.string(),
    path: z.string(),
    group_id: z.number(),
  }),
};

export const societiesSchema = {
  list,
  read,
  readPath,
  select,
};
