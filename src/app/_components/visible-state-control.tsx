"use client";

import { api } from "@/trpc/react";
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import VisibleStateWrapper from "./graphics/visible-state-wrapper";

export function VisibleStateControl(props: { event_id: string; path: string }) {
  const showState = api.visibleState.show.useMutation();
  const hideState = api.visibleState.hide.useMutation();

  const visibleStateQuery = api.visibleState.read.useQuery({
    event_id: props.event_id,
    path: props.path,
  });

  return (
    <Card withBorder>
      {visibleStateQuery.data ? (
        <VisibleStateWrapper event_id={props.event_id} path={props.path}>
          {(isVisible) => (
            <Stack>
              <Group>
                <Text>{visibleStateQuery.data?.name}</Text>
                <Text c="dimmed">{visibleStateQuery.data?.path}</Text>
              </Group>
              <Center>
                <Title>{isVisible ? "Visible" : "Hidden"}</Title>
              </Center>
              <Group>
                <Button
                  onClick={() => {
                    void showState.mutate({
                      event_id: props.event_id,
                      path: props.path,
                    });
                  }}
                  ml={"auto"}
                >
                  Show
                </Button>
                <Button
                  onClick={() => {
                    void hideState.mutate({
                      event_id: props.event_id,
                      path: props.path,
                    });
                  }}
                >
                  Hide
                </Button>
              </Group>
            </Stack>
          )}
        </VisibleStateWrapper>
      ) : (
        <Center>
          <Loader />
        </Center>
      )}
    </Card>
  );
}
