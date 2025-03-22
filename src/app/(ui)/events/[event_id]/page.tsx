"use client";

import { Form, TextField } from "@/app/_components/form";
import { useWebsocket } from "@/app/_components/websocket-provider";
import { schemas } from "@/server/api/schemas";
import { api } from "@/trpc/react";
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
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

  const selectMtOption = api.mtOptions.select.useMutation();

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
              </Group>
              <Stack>
                <Group>
                  <Button onClick={() => setMtIdAdding(mtIdAdding ?? mt.id)}>
                    Add Option
                  </Button>
                </Group>
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
