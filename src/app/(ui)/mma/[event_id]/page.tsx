"use client";

import { api } from "@/trpc/react";
import { Button } from "@mantine/core";
import { use } from "react";

export default function MMAPage({
  params,
}: {
  params: Promise<{ event_id: string }>;
}) {
  const awaitedParams = use(params);

  const toggleMMAVisibility = api.visibleState.toggle.useMutation();
  return (
    <Button
      onClick={() =>
        toggleMMAVisibility.mutate({
          event_id: awaitedParams.event_id,
          path: "main",
        })
      }
    >
      Toggle
    </Button>
  );
}
