"use client";

import Layer from "@/app/_components/graphics/layer";
import { useWebsocket } from "@/app/_components/websocket-provider";
import { api } from "@/trpc/react";
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import Image from "next/image";
import { DetailedHTMLProps, HTMLAttributes, use, useEffect } from "react";

export default function SingleEventPage({
  params,
}: {
  params: Promise<{ event_id: string }>;
}) {
  const awaitedParams = use(params);

  const event = api.events.getPrivateState.useQuery({
    event_id: awaitedParams.event_id,
  });

  const { socket } = useWebsocket();

  useEffect(() => {
    function onCurrentQuestionUpdate() {
      event.refetch().catch(() => console.log("Failed to update"));
    }

    socket.on(
      `update:event:${awaitedParams.event_id}`,
      onCurrentQuestionUpdate,
    );

    return () => {
      socket.off(
        `update:event:${awaitedParams.event_id}`,
        onCurrentQuestionUpdate,
      );
    };
  });

  if (!event.data) {
    return <></>;
  }

  const eventState = event.data;

  const layers: DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >[] = [
    {
      style: {
        width: "90%",
        height: "200px",
        bottom: "5%",
        left: "5%",
        opacity: 1,
        backgroundColor: "#e74c3c",
        borderRadius: "32px",
      },
    },
    {
      style: {
        bottom: "6%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 1,
      },
      children: (
        <p
          style={{
            margin: 0,
            width: "90vw",
            maxHeight: "90vh",
            textAlign: "center",
            fontFamily: '"Bebas Neue", serif',
            fontWeight: 700,
            color: "#f4e9e1",
            fontSize: "90px",
          }}
        >
          {
            eventState.multi_texts.find((mt) => mt.path === "name")
              ?.multi_text_selected?.selected_option.content
          }
        </p>
      ),
    },
    {
      style: {
        bottom: "5%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 1,
      },
      children: (
        <p
          style={{
            margin: 0,
            width: "90vw",
            maxHeight: "90vh",
            textAlign: "center",
            fontFamily: '"Bebas Neue", serif',
            fontWeight: 700,
            color: "#f4e9e1",
            fontSize: "40px",
          }}
        >
          {
            eventState.multi_texts.find((mt) => mt.path === "extra_info")
              ?.multi_text_selected?.selected_option.content
          }
        </p>
      ),
    },
    {
      style: {
        position: "absolute",
        bottom: "6%",
        left: "8%",
        opacity: 1,
        zIndex: 5,
      },
      children: (
        <Image
          width={170}
          height={170}
          src={"/_assets/elections/ballot-box.png"}
          alt={"This is a graphics site, I don't need alt text"}
        />
      ),
    },
  ];

  return (
    <>
      {layers.map((layer, idx) => {
        return <Layer {...layer} zIndex={idx} key={idx} />;
      })}
    </>
  );
}
