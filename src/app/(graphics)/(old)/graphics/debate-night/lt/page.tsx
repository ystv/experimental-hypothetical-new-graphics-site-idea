import Layer from "@/app/_components/graphics/layer";
import Image from "next/image";
import { type DetailedHTMLProps, type HTMLAttributes } from "react";

export default function LowerThirdPage() {
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
          Debate Chair
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
          Description
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
