"use client";

import { Form, SelectField } from "@/app/_components/form";
import { TextField } from "@/app/_components/form-fields/text";
import { useWebsocket } from "@/app/_components/websocket-provider";
import { schemas } from "@/server/api/schemas";
import { api } from "@/trpc/react";
import { Button, Card, Group, Modal, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useEffect } from "react";

function CreateEventForm(props: { onSuccess: () => void }) {
  const eventTypes = api.eventTypes.readMany.useQuery();

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
      {eventTypes.data && (
        <SelectField
          name="event_type_id"
          options={eventTypes.data}
          renderOption={(event_type) => event_type.name}
          getOptionValue={(event_type) => event_type.id}
          filter={(event_type, filter) =>
            event_type.name.toLowerCase().includes(filter.toLowerCase())
          }
          label="Event Type"
          required
        />
      )}
    </Form>
  );
}

export default function EventTypesPage() {
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
      <Modal opened={createModalOpened} onClose={closeCreateModal}>
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
