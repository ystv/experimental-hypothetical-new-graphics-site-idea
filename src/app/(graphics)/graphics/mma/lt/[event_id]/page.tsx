"use client";

import Layer from "@/app/_components/graphics/layer";
import Image from "next/image";
import {
  use,
  useEffect,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from "react";
import { useTimer } from "react-timer-hook";
import { useWebsocket } from "@/app/_components/websocket-provider";
import MultiText from "@/app/_components/graphics/multi-text";
import { EventProvider } from "@/app/_components/event-provider";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import VisibleStateWrapper from "@/app/_components/graphics/visible-state-wrapper";
import TimerWrapper from "@/app/_components/graphics/timer-wrapper";

export default function LowerThirdPage({
  params,
}: {
  params: Promise<{ event_id: string }>;
}) {
  const awaitedParams = use(params);

  const event = api.events.getPrivateState.useQuery({
    event_id: awaitedParams.event_id,
  });

  const time = new Date();

  time.setSeconds(time.getSeconds() + 300);

  const { minutes, seconds } = useTimer({
    expiryTimestamp: time,
    autoStart: true,
  });

  const borderRadius = "15px";

  if (!event.data) return <></>;

  return (
    <>
      <EventProvider event={event.data}>
        <VisibleStateWrapper path="main" event_id={event.data?.id}>
          {(state) => (
            <motion.div animate={{ opacity: state ? 1 : 0 }}>
              <motion.div
                style={{
                  position: "absolute",
                  backgroundColor: "#333",
                  width: "10%",
                  height: "5%",
                  bottom: "8%",
                  left: "45%",
                  borderRadius: "10px 10px 0 0",
                }}
              />
              <motion.div
                style={{
                  position: "absolute",
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: 24,
                  width: "10%",
                  bottom: "8%",
                  paddingBottom: "0.5%",
                  left: "45%",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                Round 1
              </motion.div>
              <motion.div
                style={{
                  position: "absolute",
                  backgroundColor: "#e34848",
                  width: "45%",
                  height: "8%",
                  bottom: "5%",
                  left: "5%",
                  borderRadius: `${borderRadius} 0 0 ${borderRadius}`,
                }}
              />
              <MultiText event_id={event.data?.id} path="red_fighter">
                {(multiText) => (
                  <motion.div
                    style={{
                      position: "absolute",
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: 38,
                      width: "36%",
                      bottom: "6.5%",
                      left: "7%",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    {multiText.content}
                  </motion.div>
                )}
              </MultiText>
              <motion.div
                style={{
                  position: "absolute",
                  backgroundColor: "#4979d5",
                  width: "45%",
                  height: "8%",
                  bottom: "5%",
                  right: "5%",
                  borderRadius: `0 ${borderRadius} ${borderRadius} 0`,
                }}
              />
              <MultiText event_id={event.data?.id} path="blue_fighter">
                {(multiText) => (
                  <motion.div
                    style={{
                      position: "absolute",
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: 38,
                      width: "36%",
                      bottom: "6.5%",
                      right: "7%",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    {multiText.content}
                  </motion.div>
                )}
              </MultiText>
              <motion.div
                style={{
                  position: "absolute",
                  background:
                    "linear-gradient(90deg, rgba(227,72,72,1) 0%, rgba(73,121,213,1) 100%)",
                  width: "20%",
                  height: "8%",
                  bottom: "5%",
                  left: "40%",
                  opacity: 1,
                }}
              />
              <VisibleStateWrapper path="timer" event_id={event.data?.id}>
                {(timerState) => (
                  <>
                    <motion.div
                      style={{
                        position: "absolute",
                        background:
                          "linear-gradient(90deg, #e34848 0%, #333 25%, #333 75%, #4979d5 100%)",
                        width: "20%",
                        height: "8%",
                        bottom: "5%",
                        left: "40%",
                      }}
                      animate={{
                        opacity: timerState ? 1 : 0,
                      }}
                    />
                    <TimerWrapper event_id={event.data!.id} path="countdown">
                      {({ minutes, seconds }) => (
                        <motion.div
                          style={{
                            position: "absolute",
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 800,
                            fontSize: 38,
                            width: "10%",
                            bottom: "6.5%",
                            left: "45%",
                            color: "#fff",
                            textAlign: "center",
                          }}
                          animate={{
                            opacity: timerState ? 1 : 0,
                          }}
                        >
                          {minutes.toString().padStart(2, "0")}:
                          {seconds.toString().padStart(2, "0")}
                        </motion.div>
                      )}
                    </TimerWrapper>
                  </>
                )}
              </VisibleStateWrapper>
            </motion.div>
          )}
        </VisibleStateWrapper>
      </EventProvider>
    </>
  );
}
