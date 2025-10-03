"use client";

import SocietyStateWrapper from "@/app/_components/graphics/society-data-wrapper";
import { useVisibleState } from "@/app/_components/graphics/visible-state-wrapper";
import { animate, motion } from "framer-motion";
import Image from "next/image";
import { use, useEffect, useRef } from "react";

export default function OverlayPage(props: {
  params: Promise<{ event_id: string; path: string }>;
}) {
  const awaitedParams = use(props.params);

  const visible = useVisibleState("society_overlay", awaitedParams.event_id);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;
    if (visible) {
      animate([[mainRef.current, { bottom: 50 }]]);
    } else {
      animate([[mainRef.current, { bottom: -150 }]]);
    }
  }, [visible, mainRef]);

  return (
    <SocietyStateWrapper
      event_id={awaitedParams.event_id}
      path={awaitedParams.path}
    >
      {(state) =>
        state?.societyData && (
          <motion.div
            ref={mainRef}
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
          </motion.div>
        )
      }
    </SocietyStateWrapper>
  );
}
