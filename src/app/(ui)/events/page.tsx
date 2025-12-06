"use client";

import { Form, SelectField } from "@/app/_components/form";
import { GraphicsCollectionsField } from "@/app/_components/form-fields/graphics-collections";
import { TextField } from "@/app/_components/form-fields/text";
import { useWebsocket } from "@/app/_components/websocket-provider";
import { getGraphicsCollections } from "@/lib/graphics";
import { schemas } from "@/server/api/schemas";
import { api } from "@/trpc/react";
import {
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useEffect } from "react";

function CreateEventForm(props: { onSuccess: () => void }) {
  const createEvent = api.events.create.useMutation();

  return (
    <Form
      schema={schemas.events.create.input}
      action={async (data) => {
        const success = await new Promise<boolean>((resolve) => {
          createEvent.mutate(data, {
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
            errors: { root: createEvent.error?.message },
          };
        }
        return { ok: true, data: createEvent.data! };
      }}
      onSuccess={props.onSuccess}
    >
      <TextField
        name="name"
        label="Name"
        placeholder="MMA Fight Night 2025"
        required
      />
      <Space h="md" />
      <GraphicsCollectionsField name="collections" label="Collections" />
    </Form>
  );
}

export default function EventsPage() {
  const events = api.events.readMany.useQuery();

  const { socket } = useWebsocket();

  useEffect(() => {
    function onCurrentQuestionUpdate() {
      events.refetch().catch(() => console.log("Failed to update"));
    }

    socket.on("update:events", onCurrentQuestionUpdate);

    return () => {
      socket.off("update:events", onCurrentQuestionUpdate);
    };
  });

  const [
    createModalOpened,
    { close: closeCreateModal, open: openCreateModal },
  ] = useDisclosure(false);

  return (
    <Stack>
      {getGraphicsCollections().map((graphicsCollection) => {
        return (
          <Text key={graphicsCollection.key}>
            {graphicsCollection.key}: {graphicsCollection.value.slug}
          </Text>
        );
      })}
      <Divider />
      <Modal opened={createModalOpened} onClose={closeCreateModal} size={"xl"}>
        <CreateEventForm onSuccess={closeCreateModal} />
      </Modal>
      <Button onClick={openCreateModal} mr={"auto"}>
        Create Event
      </Button>
      {events.data?.map((event) => {
        return (
          <Card key={event.id} withBorder>
            <Group>
              <Stack>
                <Title>{event.name}</Title>
              </Stack>
              <Button ml={"auto"} component={Link} href={`/events/${event.id}`}>
                View
              </Button>
            </Group>
          </Card>
        );
      })}
    </Stack>
  );
}
