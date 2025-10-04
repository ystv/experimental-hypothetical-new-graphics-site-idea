"use client";

import SocietyStateWrapper from "@/app/_components/graphics/society-data-wrapper";
import { useVisibleState } from "@/app/_components/graphics/visible-state-wrapper";
import { useElementSize } from "@mantine/hooks";
import { animate, AnimatePresence, motion, type Variants } from "framer-motion";
import { use, useEffect, useRef } from "react";

export default function OverlayPage(props: {
  params: Promise<{ event_id: string; path: string }>;
}) {
  const awaitedParams = use(props.params);

  const visible = useVisibleState("society_overlay", awaitedParams.event_id);

  const mainRef = useRef<HTMLDivElement>(null);
  const { width: textWidth, ref: textRef } = useElementSize({});

  useEffect(() => {
    if (!mainRef.current) return;
    if (visible) {
      animate([
        [mainRef.current, { bottom: 50 }],
        [textRef.current, { marginLeft: 0 }],
      ]);
    } else {
      animate([
        [textRef.current, { marginLeft: -(textWidth + 60) }],
        [mainRef.current, { bottom: -150 }],
      ]);
    }
  }, [visible, mainRef, textRef, textWidth]);

  const variants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: [0, 0, 1] },
    exit: { opacity: [1, 0, 0] },
  };

  return (
    <SocietyStateWrapper
      event_id={awaitedParams.event_id}
      path={awaitedParams.path}
    >
      {(state) =>
        state?.societyData && (
          <AnimatePresence>
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
                overflow: "hidden",
                minWidth: state.societyData.thumbnail_url ? 120 : 0,
              }}
            >
              {state.societyData.thumbnail_url && (
                <div
                  style={{
                    borderRadius: "16px 0 0 16px",
                    overflow: "hidden",
                    height: 150,
                    width: 150,
                    flexShrink: 0,
                    zIndex: 40,
                    backgroundColor: "white",
                  }}
                >
                  <motion.img
                    src={
                      state.societyData.group_id == 137
                        ? "/square-logo-trans.webp"
                        : state?.societyData.thumbnail_url
                    }
                    height={150}
                    width={150}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    alt="Society Logo"
                    key={"society-logo-" + state.societyData.group_id}
                  />
                </div>
              )}
              <div
                style={{
                  paddingLeft: 30,
                  paddingTop: "20px",
                  position: "relative",
                  // marginLeft: -(textWidth + 60),
                  // marginLeft: -400,
                  // maskImage:
                  //   "linear-gradient(to left, black 20%, transparent 60%)",
                }}
                ref={textRef}
              >
                <motion.div
                  style={{
                    fontWeight: 700,
                  }}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  key={state.societyData.name}
                >
                  {state.societyData.name}
                </motion.div>
                <motion.div
                  style={{
                    marginTop: -15,
                  }}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  key={
                    state.societyData.instagram +
                    state.societyData.email_address
                  }
                >
                  {state.societyData.instagram !== ""
                    ? "@" + state.societyData.instagram
                    : state.societyData.email_address}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        )
      }
    </SocietyStateWrapper>
  );
}
