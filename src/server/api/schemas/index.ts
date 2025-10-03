import { eventsSchema } from "./events.schema";
import { eventTypesSchema } from "./eventTypes.schema";
import { mtOptionsSchema } from "./mtOption.schema";
import { multiTextsSchema } from "./multiTexts.schema";
import { societiesSchema } from "./societies.schema";
import { timersSchema } from "./timers.schema";

export const schemas = {
  eventTypes: eventTypesSchema,
  events: eventsSchema,
  mtOptions: mtOptionsSchema,
  multiTexts: multiTextsSchema,
  societies: societiesSchema,
  timers: timersSchema,
};
