"use client";

import { api } from "@/trpc/react";
import { Button } from "@mantine/core";

export default function OBSTestServerPage() {
  const cutSyncerAction = api.obs.cutSyncer.useMutation();

  return (
    <Button onClick={() => cutSyncerAction.mutate()}>Cut to Syncer</Button>
  );
}
