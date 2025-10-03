"use client";

import { Form, NamePathArrayField } from "@/app/_components/form";
import { TextField } from "@/app/_components/form-fields/text";
import { useWebsocket } from "@/app/_components/websocket-provider";
import { schemas } from "@/server/api/schemas";
import { api } from "@/trpc/react";
import {
  Button,
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
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
      <Stack>
        <TextField name="name" label="Name" placeholder="MMA Fight" required />
        <NamePathArrayField label="Multi Texts" name="multi_text_skeleton" />
        <NamePathArrayField label="Timers" name="timer_skeleton" />
        <NamePathArrayField
          label="Visible States"
          name="visible_state_skeleton"
        />
        <NamePathArrayField label="Societies" name="society_skeleton" />
      </Stack>
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
      <Modal opened={createModalOpened} onClose={closeCreateModal} size={"lg"}>
        <CreateEventTypeForm onSuccess={closeCreateModal} />
      </Modal>
      <Button onClick={openCreateModal} mr={"auto"}>
        Create Event Type
      </Button>
      {eventTypes.data ? (
        eventTypes.data?.map((eventType) => {
          return (
            <Card key={eventType.id} withBorder>
              <Stack gap={5}>
                <Title>{eventType.name}</Title>
                <Divider />
                <Stack gap={0}>
                  <Title order={4}>Multi Text Skeleton</Title>
                  {eventType.multi_text_skeleton.map((multiTextSkeleton) => {
                    return (
                      <Group key={multiTextSkeleton.path}>
                        <Text>{multiTextSkeleton.name}</Text>
                        <Text ml={"auto"}>{multiTextSkeleton.path}</Text>
                      </Group>
                    );
                  })}
                </Stack>
                <Divider />
                <Stack gap={0}>
                  <Title order={4}>Timers Skeleton</Title>
                  {eventType.timer_skeleton.map((timer, idx) => {
                    return (
                      <Group key={idx}>
                        <Text>{timer.name}</Text>
                        <Text ml={"auto"}>{timer.path}</Text>
                      </Group>
                    );
                  })}
                </Stack>
                <Divider />
                <Stack gap={0}>
                  <Title order={4}>Visible States Skeleton</Title>
                  {eventType.visible_state_skeleton.map(
                    (visible_state, idx) => {
                      return (
                        <Group key={idx}>
                          <Text>{visible_state.name}</Text>
                          <Text ml={"auto"}>{visible_state.path}</Text>
                        </Group>
                      );
                    },
                  )}
                </Stack>
                <Divider />
                <Stack gap={0}>
                  <Title order={4}>Societies Skeleton</Title>
                  {eventType.society_skeleton.map((society, idx) => {
                    return (
                      <Group key={idx}>
                        <Text>{society.name}</Text>
                        <Text ml={"auto"}>{society.path}</Text>
                      </Group>
                    );
                  })}
                </Stack>
              </Stack>
            </Card>
          );
        })
      ) : (
        <Center>
          <Loader />
        </Center>
      )}
    </Stack>
  );
}
