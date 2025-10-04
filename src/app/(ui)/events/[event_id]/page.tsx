"use client";

import { Form, TextField } from "@/app/_components/form";
import { SocietyControl } from "@/app/_components/society-control";
import { TimerControl } from "@/app/_components/timer-control";
import { VisibleStateControl } from "@/app/_components/visible-state-control";
import { useWebsocket } from "@/app/_components/websocket-provider";
import { schemas } from "@/server/api/schemas";
import { api } from "@/trpc/react";
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { use, useEffect, useState } from "react";

function CreateMultiTextOptionForm(props: {
  onSuccess: () => void;
  multi_text_id: string;
}) {
  const createMtOption = api.mtOptions.create.useMutation();

  return (
    <Form
      schema={schemas.mtOptions.create.input.omit({ multi_text_id: true })}
      action={async (data) => {
        const success = await new Promise<boolean>((resolve) => {
          createMtOption.mutate(
            { ...data, multi_text_id: props.multi_text_id },
            {
              onSuccess: () => {
                console.log("Success");
                resolve(true);
              },
              onError: () => {
                console.log("Error");
                resolve(false);
              },
              onSettled: () => console.log("Settled"),
            },
          );
        });
        if (!success) {
          return {
            ok: success,
            errors: { root: createMtOption.error?.message },
          };
        }
        return { ok: true, data: createMtOption.data! };
      }}
      onSuccess={props.onSuccess}
    >
      <TextField
        name="content"
        label="Content"
        placeholder="Bossman Redfighter"
        required
      />
    </Form>
  );
}

function UpdateMultiTextOptionForm(props: {
  onSuccess: () => void;
  multi_text_option_id?: string;
  initialContent: string;
}) {
  const updateMtOption = api.mtOptions.update.useMutation();

  if (!props.multi_text_option_id) {
    return <LoadingOverlay />;
  }

  return (
    <Form
      schema={schemas.mtOptions.update.input.omit({
        multi_text_option_id: true,
      })}
      action={async (data) => {
        const success = await new Promise<boolean>((resolve) => {
          updateMtOption.mutate(
            { ...data, multi_text_option_id: props.multi_text_option_id! },
            {
              onSuccess: () => {
                console.log("Success");
                resolve(true);
              },
              onError: () => {
                console.log("Error");
                resolve(false);
              },
              onSettled: () => console.log("Settled"),
            },
          );
        });
        if (!success) {
          return {
            ok: success,
            errors: { root: updateMtOption.error?.message },
          };
        }
        return { ok: true, data: updateMtOption.data! };
      }}
      onSuccess={props.onSuccess}
      initialValues={{ content: props.initialContent }}
    >
      <TextField
        name="content"
        label="Content"
        placeholder="Bossman Redfighter"
        required
      />
    </Form>
  );
}

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

  const [mtIdAdding, setMtIdAdding] = useState<string | undefined>();
  const [mtOptionUpdating, setMtOptionUpdating] = useState<
    string | undefined
  >();

  const selectMtOption = api.mtOptions.select.useMutation();
  const deselectMtOption = api.mtOptions.deselect.useMutation();

  if (!event.data) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  const eventState = event.data;

  return (
    <>
      <Title>{eventState.name}</Title>
      <Stack>
        <Title order={3}>Visible States</Title>
        {eventState.visible_states.map((vs) => {
          return (
            <VisibleStateControl
              key={vs.id}
              event_id={eventState.id}
              path={vs.path}
            />
          );
        })}
        <Title order={3}>Timers</Title>
        {eventState.timers.map((t) => {
          return (
            <TimerControl key={t.id} event_id={eventState.id} path={t.path} />
          );
        })}
        <Title order={3}>Societies</Title>
        {eventState.societies.map((s) => {
          return (
            <SocietyControl key={s.id} event_id={eventState.id} path={s.path} />
          );
        })}
        <Title order={3}>Multi Texts</Title>
        {eventState.multi_texts.map((mt) => {
          return (
            <Card key={mt.id} withBorder>
              <Modal
                opened={mtIdAdding === mt.id}
                onClose={() => setMtIdAdding(undefined)}
              >
                <CreateMultiTextOptionForm
                  onSuccess={() => {
                    setMtIdAdding(undefined);
                  }}
                  multi_text_id={mt.id}
                />
              </Modal>
              <Group>
                <Text>{mt.name}</Text>
                <Text c="dimmed">{mt.path}</Text>
                <Button
                  onClick={() => setMtIdAdding(mtIdAdding ?? mt.id)}
                  ml={"auto"}
                >
                  Add Option
                </Button>
                <Button
                  onClick={() => deselectMtOption.mutate({
                    multi_text_id: mt.id,
                  })}
                  disabled={mt.multi_text_selected === null}
                >
                  Deselect
                </Button>
              </Group>
              <Stack>
                <Table striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Content</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mt.options.map((opt) => {
                      return (
                        <Table.Tr key={opt.id}>
                          <Modal
                            opened={mtOptionUpdating === opt.id}
                            onClose={() => setMtOptionUpdating(undefined)}
                          >
                            <UpdateMultiTextOptionForm
                              onSuccess={() => {
                                setMtOptionUpdating(undefined);
                              }}
                              multi_text_option_id={opt.id}
                              initialContent={opt.content}
                            />
                          </Modal>
                          <Table.Td>
                            <Group>
                              <Text>{opt.content}</Text>
                              <Button
                                ml={"auto"}
                                onClick={() =>
                                  selectMtOption.mutate({
                                    multi_text_id: mt.id,
                                    option_id: opt.id,
                                  })
                                }
                                disabled={
                                  mt.multi_text_selected?.selected_option_id ===
                                  opt.id
                                }
                              >
                                Select
                              </Button>
                              <Button
                                onClick={() => setMtOptionUpdating(opt.id)}
                              >
                                Edit
                              </Button>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}
