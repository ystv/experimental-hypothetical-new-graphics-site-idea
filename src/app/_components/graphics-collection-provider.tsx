"use client";

import { EventGraphicsCollection } from "@prisma/client";
import { AnimatePresence } from "framer-motion";
import { type ReactNode, createContext, useContext } from "react";

type TEventGraphicsCollection = EventGraphicsCollection | undefined;

export const EventGraphicsCollectionContext =
  createContext<TEventGraphicsCollection>(
    null as unknown as TEventGraphicsCollection,
  );

export function useGraphicsCollection() {
  return useContext(EventGraphicsCollectionContext);
}

export function EventGraphicsCollectionProvider({
  children,
  graphicsCollection,
}: {
  children: ReactNode;
  graphicsCollection: EventGraphicsCollection;
}) {
  return (
    <EventGraphicsCollectionContext.Provider value={graphicsCollection}>
      <AnimatePresence>{children}</AnimatePresence>
    </EventGraphicsCollectionContext.Provider>
  );
}
