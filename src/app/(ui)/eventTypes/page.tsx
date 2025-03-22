"use client";

import { Form } from "@/app/_components/form";
import { TextField } from "@/app/_components/form-fields/text";
import { useWebsocket } from "@/app/_components/websocket-provider";
import { schemas } from "@/server/api/schemas";
import { api } from "@/trpc/react";
import { Button, Card, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

function CreateEventTypeForm(props: { onSuccess: () => void }) {
  const createEventType = api.eventTypes.create.useMutation();

  return (
    <Form
      schema={schemas.eventTypes.create.input}
      action={async (data) => {
        const success = await new Promise<boolean>((resolve) => {
          createEventType.mutate(data, {
            onSuccess: () => {
              console.log("Success");
              resolve(true);
            },
            onError: () => {
              console.log("Error");
              resolve(false);
            },
            onSettled: () => console.log("Settled"),
          });
        });
        if (!success) {
          return {
            ok: success,
            errors: { root: createEventType.error?.message },
          };
        }
        return { ok: true, data: createEventType.data! };
      }}
      onSuccess={props.onSuccess}
    >
      <TextField name="name" label="Name" placeholder="MMA Fight" required />
    </Form>
  );
}

export default function EventTypesPage() {
  const eventTypes = api.eventTypes.readMany.useQuery();

  const { socket } = useWebsocket();

  useEffect(() => {
    function onCurrentQuestionUpdate() {
      eventTypes
        .refetch()
        .catch(() => console.log("Failed to update current question"));
    }

    socket.on("update:eventTypes", onCurrentQuestionUpdate);

    return () => {
      socket.off("update:eventTypes", onCurrentQuestionUpdate);
    };
  });

  const [
    createModalOpened,
    { close: closeCreateModal, open: openCreateModal },
  ] = useDisclosure(false);

  return (
    <Stack>
      <Modal opened={createModalOpened} onClose={closeCreateModal}>
        <CreateEventTypeForm onSuccess={closeCreateModal} />
      </Modal>
      <Button onClick={openCreateModal} mr={"auto"}>
        Create Event Type
      </Button>
      {eventTypes.data?.map((eventType) => {
        return (
          <Card key={eventType.id} withBorder>
            <Stack>
              <Title>{eventType.name}</Title>
              {eventType.multi_text_skeleton.map((multiTextSkeleton, idx) => {
                return (
                  <Group key={multiTextSkeleton.path}>
                    <Text>{multiTextSkeleton.name}</Text>
                    <Text ml={"auto"}>{multiTextSkeleton.path}</Text>
                  </Group>
                );
              })}
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}
