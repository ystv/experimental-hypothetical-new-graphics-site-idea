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
import TimerWrapper from "./graphics/timer-wrapper";

export function TimerControl(props: { event_id: string; path: string }) {
  const startTimer = api.timers.start.useMutation();
  const pauseTimer = api.timers.pause.useMutation();
  const resetTimer = api.timers.reset.useMutation();

  const timerQuery = api.timers.read.useQuery({
    event_id: props.event_id,
    path: props.path,
  });

  return (
    <Card withBorder>
      {timerQuery.data ? (
        <TimerWrapper event_id={props.event_id} path={props.path}>
          {({ minutes, seconds, isRunning, totalSeconds }) => (
            <Stack>
              <Group>
                <Text>{timerQuery.data?.name}</Text>
                <Text c="dimmed">{timerQuery.data?.path}</Text>
              </Group>
              <Center>
                <Title>
                  {minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}
                </Title>
              </Center>
              <Group>
                <Button
                  onClick={() => {
                    void startTimer.mutate({
                      event_id: props.event_id,
                      path: props.path,
                    });
                  }}
                  ml={"auto"}
                  disabled={isRunning}
                >
                  {totalSeconds === timerQuery.data?.duration_seconds
                    ? "Start"
                    : "Resume"}
                </Button>
                <Button
                  onClick={() => {
                    void pauseTimer.mutate({
                      event_id: props.event_id,
                      path: props.path,
                    });
                  }}
                  disabled={!isRunning}
                >
                  Pause
                </Button>
                <Button
                  onClick={() => {
                    void resetTimer.mutate({
                      event_id: props.event_id,
                      path: props.path,
                    });
                  }}
                  disabled={
                    totalSeconds === timerQuery.data?.duration_seconds &&
                    !isRunning
                  }
                  color="red"
                >
                  Reset
                </Button>
              </Group>
            </Stack>
          )}
        </TimerWrapper>
      ) : (
        <Center>
          <Loader />
        </Center>
      )}
    </Card>
  );
}
