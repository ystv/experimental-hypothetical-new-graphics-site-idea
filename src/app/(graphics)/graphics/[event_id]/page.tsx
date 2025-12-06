"use client";

import { use } from "react";
import { EventProvider } from "@/app/_components/event-provider";
import { api } from "@/trpc/react";
import { EventGraphicsCollectionProvider } from "@/app/_components/graphics-collection-provider";
import { useSocketTriggeredFunction } from "@/lib/socket/wrapper";
import { getGraphicsCollections } from "@/lib/graphics";

export default function EventGraphicsPage({
  params,
}: {
  params: Promise<{ event_id: string }>;
}) {
  const awaitedParams = use(params);

  const event = api.events.getPrivateState.useQuery({
    event_id: awaitedParams.event_id,
  });

  useSocketTriggeredFunction(
    `update:event:${awaitedParams.event_id}`,
    () => void event.refetch(),
  );

  if (!event.data) return <></>;

  return (
    <>
      <EventProvider event={event.data}>
        {event.data.graphics_collections.map((graphicsCollection) => {
          const collection = getGraphicsCollections().find(
            (v) => v.key === graphicsCollection.collection_slug,
          );

          if (!collection) return <></>;
          return (
            <EventGraphicsCollectionProvider
              key={graphicsCollection.id}
              graphicsCollection={graphicsCollection}
            >
              {collection.value.components.map((Component) => (
                <Component
                  key={Component.name}
                  graphics_collection_id={graphicsCollection.id}
                />
              ))}
            </EventGraphicsCollectionProvider>
          );
        })}
      </EventProvider>
    </>
  );
}
