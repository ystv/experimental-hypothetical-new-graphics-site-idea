"use client";

import { useSocketTriggeredFunction } from "@/lib/socket/wrapper";
import { api } from "@/trpc/react";
import type React from "react";
import { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import { type useTimerResultType } from "react-timer-hook/dist/types/src/useTimer";

export default function TimerWrapper(props: {
  key?: string | number;
  children: (timer: useTimerResultType) => React.ReactNode;
  event_id: string;
  path: string;
}) {
  const timerQuery = api.timers.read.useQuery({
    event_id: props.event_id,
    path: props.path,
  });

  useSocketTriggeredFunction(
    `update:timer:${props.event_id}:${props.path}`,
    () => {
      void timerQuery.refetch();
    },
  );

  const timer = useTimer({
    expiryTimestamp: timerQuery.data?.ends_at ?? new Date(),
    autoStart: !timerQuery.data?.paused,
  });

  useEffect(() => {
    if (!timerQuery.data) return;
    if (timerQuery.data.paused && timerQuery.data.paused_at_seconds) {
      timer.restart(
        new Date(Date.now() + timerQuery.data.paused_at_seconds * 1000),
        false,
      );
    } else {
      const newExpiry = new Date(timerQuery.data.ends_at);
      timer.restart(newExpiry, true);
    }
  }, [timerQuery.data]);

  return props.children(timer);
}
