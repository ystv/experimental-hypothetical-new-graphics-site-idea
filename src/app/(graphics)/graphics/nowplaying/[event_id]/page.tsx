'use client';

import { EventProvider } from "@/app/_components/event-provider";
import VisibleStateWrapper from "@/app/_components/graphics/visible-state-wrapper";
import { api } from "@/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import { use } from "react";

import styles from './nowplaying.module.css';
import MultiText from "@/app/_components/graphics/multi-text";

export default function LowerThirdPage({
  params,
}: {
  params: Promise<{ event_id: string }>;
}) {
  const awaitedParams = use(params);

  const event = api.events.getPrivateState.useQuery({
    event_id: awaitedParams.event_id,
  });

  if (!event.data) return <></>;

  return (
    <EventProvider event={event.data}>
      <VisibleStateWrapper path="show" event_id={event.data?.id}>
        {(state) => (
          <AnimatePresence>
            {state && (
              <motion.div
                className={styles.root}
                style={{
                  overflow: "hidden",
                }}
                // ref={scope}
                initial={{
                  width: "256px",
                  left: "832px",
                  opacity: 0,
                }}
                animate={{
                  width: ["256px", "256px", "1152px"],
                  left: ["832px", "832px", "384px"],
                  opacity: [0, 1, 1],
                  transition: { duration: 1.5 },
                  keyTimes: [0, 0.333, 1],
                }}
                exit={{
                  width: ["1152px", "256px", "256px"],
                  left: ["384px", "832px", "832px"],
                  opacity: [1, 1, 0],
                  color: ["black", "white", "white"],
                  transition: { duration: 1 },
                }}
              >
                <motion.img
                  src='https://sums-data-public.sums.su/YU/group-thumbnails/140/0IAoMLGtWZBC.png' // TODO
                  width={224}
                  height={224}
                  className={styles.societyLogo}
                />

                <div>
                  <MultiText event_id={event.data?.id} path="title">
                    {(text) => (
                      <motion.h1
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                          transition: { delay: 1.5 },
                        }}
                      >
                        {text.content}
                      </motion.h1>
                    )}
                  </MultiText>
                  <MultiText event_id={event.data?.id} path="subtitle">
                    {(text) => (
                      <motion.p
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                          transition: { delay: 1.75 },
                        }}
                        style={{
                          color: state ? undefined : "white",
                        }}
                      >
                        {text.content}
                      </motion.p>
                    )}
                  </MultiText>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </VisibleStateWrapper>
    </EventProvider>
  );
}
