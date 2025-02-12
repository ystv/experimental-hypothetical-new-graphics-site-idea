"use client";

import { useWebsocket } from "@/app/_components/websocket-provider";
import { api } from "@/trpc/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";

export default function FullscreenOutputIDPage() {
  const params = z.object({ output_id: z.coerce.number() }).parse(useParams());

  const currentOutputQuestion = api.output.getCurrent.useQuery({
    output_id: params.output_id,
  });

  const { socket } = useWebsocket();

  useEffect(() => {
    function onCurrentQuestionUpdate() {
      currentOutputQuestion
        .refetch()
        .catch(() => console.log("Failed to update current question"));
    }

    socket.on(`update:output:${params.output_id}`, onCurrentQuestionUpdate);

    return () => {
      socket.off(`update:output:${params.output_id}`, onCurrentQuestionUpdate);
    };
  });

  return (
    <>
      <div
        style={{
          width: "1920px",
          height: "1080px",
        }}
      >
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            zIndex: 0,
          }}
        >
          <Image
            src={"/yorquestion-time-fullscreen.png"}
            alt={""}
            width={1920}
            height={1080}
            quality={100}
          />
        </div>
        <div
          style={{
            zIndex: 10,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: '"Bebas Neue", serif',
            fontWeight: 600,
            color: "#f4e9e1",
            fontSize: "100px",
          }}
        >
          <p
            style={{
              margin: 0,
              width: "90vw",
              maxHeight: "90vh",
              textAlign: "center",
            }}
          >
            {currentOutputQuestion.data?.text}
          </p>
        </div>
      </div>
    </>
  );
}
