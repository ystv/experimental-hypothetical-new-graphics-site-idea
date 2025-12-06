import Image from "next/image";

export default function HoldingCardPage() {
  return (
    <>
      {/* <div
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
            backgroundColor: "black",
          }}
        />
      </div> */}
      <div
        style={{
          width: "1920px",
          height: "1080px",
          opacity: 1,
          zIndex: 2,
          backgroundColor: "#000",
        }}
      >
        {/* <YDCSnow /> */}
        <Image
          width={1920}
          height={1080}
          style={{
            opacity: 0.5,
          }}
          src={"/ydc_snow.svg"}
          alt={"This is a graphics site, I don't need alt text"}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 1,
          zIndex: 5,
        }}
      >
        <Image
          width={500}
          height={500}
          src={"/ydc_logo.png"}
          alt={"This is a graphics site, I don't need alt text"}
        />
      </div>
      <div
        style={{
          zIndex: 10,
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: '"Dancing Script", serif',
          fontWeight: 700,
          color: "#fdcc53",
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
          York Dance Comp 2025
        </p>
      </div>
    </>
  );
}
