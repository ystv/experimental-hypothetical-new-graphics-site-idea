"use client";

import SocietyStateWrapper from "@/app/_components/graphics/society-data-wrapper";
import Image from "next/image";
import { use } from "react";

export default function OverlayPage(props: {
  params: Promise<{ event_id: string; path: string }>;
}) {
  const awaitedParams = use(props.params);

  return (
    <SocietyStateWrapper
      event_id={awaitedParams.event_id}
      path={awaitedParams.path}
    >
      {(state) =>
        state?.societyData && (
          <div
            style={{
              height: "150px",
              width: "fit-content",
              backgroundColor: "white",
              color: "black",
              fontSize: "45px",
              paddingRight: 30,
              position: "fixed",
              borderRadius: 16,
              bottom: 50,
              left: 50,
              display: "inline-flex",
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            {state.societyData.thumbnail_url && (
              <Image
                src={
                  state.societyData.group_id == 137
                    ? "/square-logo-trans.webp"
                    : state?.societyData.thumbnail_url
                }
                height={150}
                width={150}
                style={{
                  borderRadius: "16px 0px 0px 16px",
                }}
                alt="Society Logo"
                quality={100}
              />
            )}
            <div
              style={{
                paddingLeft: 22.5,
                paddingTop: "20px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                }}
              >
                {state.societyData.name}
              </div>
              <div
                style={{
                  marginTop: -15,
                }}
              >
                {state.societyData.instagram !== ""
                  ? "@" + state.societyData.instagram
                  : state.societyData.email_address}
              </div>
            </div>
          </div>
        )
      }
    </SocietyStateWrapper>
  );
}
