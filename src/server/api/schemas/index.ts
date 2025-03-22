import { eventsSchema } from "./events.schema";
import { eventTypesSchema } from "./eventTypes.schema";
import { mtOptionsSchema } from "./mtOption.schema";

export const schemas = {
  eventTypes: eventTypesSchema,
  events: eventsSchema,
  mtOptions: mtOptionsSchema,
};
