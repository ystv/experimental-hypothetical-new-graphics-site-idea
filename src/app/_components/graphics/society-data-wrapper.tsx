import { useSocketTriggeredFunction } from "@/lib/socket/wrapper";
import { api } from "@/trpc/react";
import { useEvent } from "../event-provider";
import React from "react";
import { z } from "zod";
import { schemas } from "@/server/api/schemas";

export default function SocietyStateWrapper(props: {
  path: string;
  event_id?: string;
  duration?: number;
  children: (
    state: z.infer<typeof schemas.societies.readPath.output>,
  ) => React.ReactNode;
}) {
  const event = useEvent();

  const event_id = props.event_id ?? event?.id;

  if (!event_id) {
    throw new Error("No event_id or event context provided");
  }

  const societyStateData = api.societies.readPath.useQuery(
    {
      event_id: props.event_id ?? event!.id,
      path: props.path,
    },
    {
      refetchInterval: 1000 * 60,
    },
  );

  useSocketTriggeredFunction(`update:society:${event_id}:${props.path}`, () => {
    societyStateData
      .refetch()
      .catch(() => console.log("Failed to update society state"));
  });

  if (!societyStateData.data) return <></>;

  return props.children(societyStateData.data);
}
