import Image from "next/image";

export default function HoldingCard() {
  return (
    <div
      style={{
        width: "1920px",
        height: "1080px",
        opacity: 1,
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
          src={"/yorquestion-time-holding.png"}
          alt={""}
          width={1920}
          height={1080}
          quality={100}
        />
      </div>
    </div>
  );
}
