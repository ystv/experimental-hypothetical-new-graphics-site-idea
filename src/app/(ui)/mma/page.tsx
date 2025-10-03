"use client";

import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/trpc/react";
import { Button } from "@mantine/core";
import { useSocketTriggeredFunction } from "@/lib/socket/wrapper";

export default function MMAPage() {
  const showMMAVisibility = api.visibleState.show.useMutation();
  const hideMMAVisibility = api.visibleState.hide.useMutation();

  const visibility = api.visibleState.read.useQuery({
    event_id: "cm8u9o6jv0003j50ca4fyh8yg",
    path: "main",
  });

  useSocketTriggeredFunction(
    "update:state:cm8u9o6jv0003j50ca4fyh8yg:main:hide",
    () => {
      void visibility.refetch();
    },
  );

  useSocketTriggeredFunction(
    "update:state:cm8u9o6jv0003j50ca4fyh8yg:main:show",
    () => {
      void visibility.refetch();
    },
  );

  return (
    <>
      <Button
        onClick={() =>
          showMMAVisibility.mutate({
            event_id: "cm8u9o6jv0003j50ca4fyh8yg",
            path: "main",
          })
        }
        disabled={visibility.data?.visible}
      >
        Show
      </Button>
      <Button
        onClick={() =>
          hideMMAVisibility.mutate({
            event_id: "cm8u9o6jv0003j50ca4fyh8yg",
            path: "main",
          })
        }
        disabled={!visibility.data?.visible}
      >
        Hide
      </Button>
      <AnimatePresence>
        {visibility.data?.visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            I will fade in and out
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
