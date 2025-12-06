"use client";

import { useWebsocket } from "@/app/_components/websocket-provider";
import { api } from "@/trpc/react";
import { Button, Stack, Table } from "@mantine/core";
import { use, useEffect } from "react";

export default function SingleEventPage({
  params,
}: {
  params: Promise<{ event_id: string }>;
}) {
  const awaitedParams = use(params);

  const event = api.events.getPrivateState.useQuery({
    event_id: awaitedParams.event_id,
  });

  const { socket } = useWebsocket();

  useEffect(() => {
    function onCurrentQuestionUpdate() {
      event.refetch().catch(() => console.log("Failed to update"));
    }

    socket.on(
      `update:event:${awaitedParams.event_id}`,
      onCurrentQuestionUpdate,
    );

    return () => {
      socket.off(
        `update:event:${awaitedParams.event_id}`,
        onCurrentQuestionUpdate,
      );
    };
  });

  return (
    <Stack>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Td>Cue</Table.Td>
            <Table.Td>Label</Table.Td>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {event.data?.cues.map((cue) => {
            return (
              <Table.Tr key={cue.id}>
                <Table.Td>{cue.number}</Table.Td>
                <Table.Td>{cue.label}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      <Button></Button>
    </Stack>
  );
}
