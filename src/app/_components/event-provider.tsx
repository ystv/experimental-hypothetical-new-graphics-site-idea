"use client";

import { type Event } from "@prisma/client";
import { type ReactNode, createContext, useContext } from "react";

type TEvent = Event | undefined;

export const EventContext = createContext<TEvent>(null as unknown as TEvent);

export function useEvent() {
  return useContext(EventContext);
}

export function EventProvider({
  children,
  event,
}: {
  children: ReactNode;
  event: Event;
}) {
  return (
    <EventContext.Provider value={event}>{children}</EventContext.Provider>
  );
}
