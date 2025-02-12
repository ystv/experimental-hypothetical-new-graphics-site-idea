"use client";

import { useWebsocket } from "@/app/_components/websocket-provider";
import { api } from "@/trpc/react";
import { ActionIcon, Button, Card, Group, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaEdit } from "react-icons/fa";

export default function OutputsPage() {
  const outputs = api.output.getAll.useQuery();

  const router = useRouter();

  const createOutput = api.output.create.useMutation();

  const { socket } = useWebsocket();

  useEffect(() => {
    function onOutputsUpdate() {
      outputs.refetch().catch(() => console.log("Failed to update outputs"));
    }

    socket.on("update:outputs", onOutputsUpdate);

    return () => {
      socket.off("update:outputs", onOutputsUpdate);
    };
  });

  return (
    <>
      <Stack>
        <Button onClick={() => createOutput.mutate()}>Create</Button>
        {outputs.data?.map((output) => {
          return (
            <Card key={output.id}>
              <Group>
                <Text>{output.id}</Text>
                <ActionIcon
                  ml={"auto"}
                  onClick={() => router.push(`/outputs/${output.id}`)}
                >
                  <FaEdit />
                </ActionIcon>
              </Group>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}
