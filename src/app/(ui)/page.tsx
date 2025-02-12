"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Button onClick={() => router.push("/outputs")}>Outputs</Button>
    </>
  );
}
