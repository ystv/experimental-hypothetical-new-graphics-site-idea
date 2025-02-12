"use client";

import { api } from "@/trpc/react";
import Image from "next/image";

export default function FullscreenText() {
  const textQuery = api.fullscreen.getText.useQuery();

  return (
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
          {textQuery.data?.text}
        </p>
      </div>
    </div>
  );
}
