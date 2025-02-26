"use client";

import Image from "next/image";

import { z } from "zod";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";

export default function HoldingCardPage() {
  const params = z.object({ output_id: z.coerce.number() }).parse(useParams());

  const currentOutput = api.ydc.output.getCurrent.useQuery(
    {
      output_id: params.output_id,
    },
    { refetchInterval: 1000 },
  );

  return (
    <>
      <div
        style={{
          width: "90%",
          height: "200px",
          position: "absolute",
          bottom: "5%",
          left: "5%",
          opacity: 1,
          zIndex: 1,
          backgroundColor: "#000",
          // backgroundImage: "url(/ydc_snow.svg)",
        }}
      />
      <div
        style={{
          width: "90%",
          height: "200px",
          position: "absolute",
          bottom: "5%",
          left: "5%",
          opacity: 0.5,
          zIndex: 2,
          // backgroundColor: "#000",
          backgroundImage: "url(/ydc_snow.svg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "4%",
          left: "6%",
          opacity: 1,
          zIndex: 5,
        }}
      >
        <Image
          width={200}
          height={200}
          src={"/ydc_logo.png"}
          alt={"This is a graphics site, I don't need alt text"}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 1,
          zIndex: 5,
        }}
      >
        <p
          style={{
            margin: 0,
            width: "90vw",
            maxHeight: "90vh",
            textAlign: "center",
            fontFamily: '"Dancing Script", serif',
            fontWeight: 700,
            color: "#fdcc53",
            fontSize: "70px",
          }}
        >
          {currentOutput.data?.team?.name}
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "4%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 1,
          zIndex: 5,
        }}
      >
        <p
          style={{
            margin: 0,
            width: "90vw",
            maxHeight: "90vh",
            textAlign: "center",
            fontFamily: '"Dancing Script", serif',
            fontWeight: 700,
            color: "#fdcc53",
            fontSize: "50px",
          }}
        >
          {currentOutput.data?.section?.name}
        </p>
      </div>
    </>
  );
}
