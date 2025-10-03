"use client";

import Layer from "@/app/_components/graphics/layer";
import Image from "next/image";
import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from "react";
import { useTimer } from "react-timer-hook";
import { useWebsocket } from "@/app/_components/websocket-provider";
import TimerWrapper from "@/app/_components/graphics/timer-wrapper";
import { useSocketTriggeredFunction } from "@/lib/socket/wrapper";
import MultiText from "@/app/_components/graphics/multi-text";
import { EventProvider } from "@/app/_components/event-provider";

export default function LowerThirdPage() {
  const { socket } = useWebsocket();

  const time = new Date();

  const state = { showTimer: true, showRound: false };

  time.setSeconds(time.getSeconds() + 300);

  const { minutes, seconds } = useTimer({
    expiryTimestamp: time,
    autoStart: true,
  });

  // const opacity = useSpringValue("8%", { config: { duration: 300 } });

  // useSocketTriggeredFunction("update:state:mma:toggle", () => {
  //   console.log("Firing");
  //   void opacity.start(opacity.get() == "8%" ? "13%" : "8%");
  // });

  const borderRadius = "15px";

  return (
    <>
      {/* <animated.div style={{ opacity }}> */}
      {/* <animated.div
        style={{
          position: "absolute",
          backgroundColor: "#333",
          width: "10%",
          height: "5%",
          bottom: opacity,
          left: "45%",
          // opacity: state.showRound ? 1 : 0,
          borderRadius: "10px 10px 0 0",
        }}
      />
      <animated.div
        style={{
          position: "absolute",
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 800,
          fontSize: 24,
          width: "10%",
          bottom: opacity,
          paddingBottom: "0.5%",
          left: "45%",
          color: "#fff",
          textAlign: "center",
          // opacity: state.showRound ? 1 : 0,
        }}
      >
        Round 1
      </animated.div>
      <animated.div
        style={{
          position: "absolute",
          backgroundColor: "#e34848",
          width: "45%",
          height: "8%",
          bottom: "5%",
          left: "5%",
          borderRadius: `${borderRadius} 0 0 ${borderRadius}`,
        }}
      />
      <MultiText event_id="cm8japr1x0006j53ma8rm11s2" path="name">
        {(multiText) => (
          <animated.div
            style={{
              position: "absolute",
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 800,
              fontSize: 38,
              width: "36%",
              bottom: "6.5%",
              left: "7%",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {multiText.content}
          </animated.div>
        )}
      </MultiText>
      <animated.div
        style={{
          position: "absolute",
          backgroundColor: "#4979d5",
          width: "45%",
          height: "8%",
          bottom: "5%",
          right: "5%",
          borderRadius: `0 ${borderRadius} ${borderRadius} 0`,
        }}
      />
      <MultiText event_id="cm8japr1x0006j53ma8rm11s2" path="extra_info">
        {(multiText) => (
          <animated.div
            style={{
              position: "absolute",
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 800,
              fontSize: 38,
              width: "36%",
              bottom: "6.5%",
              right: "7%",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {multiText.content}
          </animated.div>
        )}
      </MultiText>
      <animated.div
        style={{
          position: "absolute",
          background:
            "linear-gradient(90deg, rgba(227,72,72,1) 0%, rgba(73,121,213,1) 100%)",
          width: "20%",
          height: "8%",
          bottom: "5%",
          left: "40%",
          opacity: 1,
        }}
      />
      <animated.div
        style={{
          position: "absolute",
          background:
            "linear-gradient(90deg, #e34848 0%, #333 25%, #333 75%, #4979d5 100%)",
          // backgroundColor: "#333",
          width: "20%",
          height: "8%",
          bottom: "5%",
          left: "40%",
          opacity: state.showTimer ? 1 : 0,
        }}
      />
      <animated.div
        style={{
          position: "absolute",
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 800,
          fontSize: 38,
          width: "10%",
          bottom: "6.5%",
          left: "45%",
          color: "#fff",
          textAlign: "center",
          opacity: state.showTimer ? 1 : 0,
        }}
      >
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </animated.div> */}
      {/* </animated.div> */}
    </>
  );
}
