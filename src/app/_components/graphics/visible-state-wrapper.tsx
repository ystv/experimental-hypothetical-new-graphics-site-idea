import { useSocketTriggeredFunction } from "@/lib/socket/wrapper";
import { api } from "@/trpc/react";
import { useEvent } from "../event-provider";
import React, { useEffect } from "react";
import { z } from "zod";

export default function VisibleStateWrapper(props: {
  path: string;
  event_id?: string;
  duration?: number;
  children: (state: boolean) => React.ReactNode;
}) {
  const event = useEvent();

  const event_id = props.event_id ?? event?.id;

  if (!event_id) {
    throw new Error("No event_id or event context provided");
  }

  const visibleStateData = api.visibleState.read.useQuery(
    {
      event_id: props.event_id ?? event!.id,
      path: props.path,
    },
    {
      refetchInterval: 1000 * 60,
    },
  );

  const [visible, setVisible] = React.useState(visibleStateData.data?.visible);

  useEffect(() => {
    setVisible(visibleStateData.data?.visible);
  }, [visibleStateData.data?.visible]);

  useSocketTriggeredFunction(
    `update:state:${event_id}:${props.path}`,
    (data) => {
      const visibleData = z.object({ visible: z.boolean() }).parse(data);

      setVisible(visibleData.visible);

      visibleStateData
        .refetch()
        .catch(() => console.log("Failed to update visible state"));
    },
  );

  if (!visibleStateData.data) return <></>;

  return props.children(visible ?? false);
}
