import { useSocketTriggeredFunction } from "@/lib/socket/wrapper";
import { api } from "@/trpc/react";
import { useEvent } from "../event-provider";
import { type MultiTextOption } from "@prisma/client";
import React, { useEffect } from "react";

export default function MultiText(props: {
  path: string;
  event_id?: string;
  children: (multiTextData: MultiTextOption) => React.ReactNode;
}) {
  const event = useEvent();

  const event_id = props.event_id ?? event?.id;

  if (!event_id) {
    throw new Error("No event_id or event context provided");
  }

  const multiTextData = api.multiTexts.read.useQuery({
    event_id: props.event_id ?? event!.id,
    path: props.path,
  });

  useEffect(() => {
    multiTextData.refetch();
  }, [props.event_id, props.path])

  useSocketTriggeredFunction(
    `update:multi_text:${event_id}:${props.path}`,
    () => {
      multiTextData
        .refetch()
        .catch(() => console.log("Failed to update timer"));
    },
  );

  if (!multiTextData.data) return <></>;

  return props.children(multiTextData.data);
}
