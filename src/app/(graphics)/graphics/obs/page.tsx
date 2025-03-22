"use client";

import { useWebsocket } from "@/app/_components/websocket-provider";
import OBSWebSocket from "obs-websocket-js";
import { useEffect, useState } from "react";

export default function OBSTesting() {
  const [sceneName, setSceneName] = useState<string>();
  const [obsWebsocketConnected, setObsWebsocketConnected] =
    useState<boolean>(false);

  const { socket } = useWebsocket();

  const obs = new OBSWebSocket();

  useEffect(() => {
    async function setupOBS() {
      await obs.connect("ws://localhost:4455", "cornflakes");
    }

    setupOBS()
      .then(() => {
        console.log("Connected to OBS");
        setObsWebsocketConnected(true);
      })
      .catch(() => console.log("Failed to connect to OBS"));

    if (typeof window !== "undefined") {
      window.obsstudio.getCurrentScene((scene) => {
        setSceneName(scene.name);
      });
    }

    async function onCutSyncer() {
      await obs.call("TriggerStudioModeTransition");
    }

    function onObsConnectError() {
      console.log("OBS Connection Error");
    }

    function onObsProgramSceneChange({ sceneName }: { sceneName: string }) {
      setSceneName(sceneName);
    }

    socket.on("obs:cutSyncer", onCutSyncer);

    obs.addListener("ConnectionError", onObsConnectError);
    obs.addListener("CurrentProgramSceneChanged", onObsProgramSceneChange);

    return () => {
      socket.off("obs:cutSyncer", onCutSyncer);

      obs.removeAllListeners();
    };
  });

  if (typeof window == "undefined") {
    return <>Stupid server, stop pre-rendering me</>;
  }

  if (typeof window.obsstudio == "undefined") {
    return <>No OBS</>;
  }

  // window.addEventListener("obsSceneChanged", (event) => {
  //   setSceneName(event.detail.name);
  // });

  return (
    <div
      style={{
        width: "1920px",
        height: "1080px",
      }}
    >
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
        <div
          style={{
            margin: 0,
            width: "90vw",
            maxHeight: "90vh",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0 }}>OBS Version</p>
          <p style={{ margin: 0 }}>{window.obsstudio.pluginVersion}</p>
          <p style={{ margin: 0 }}>Active Scene:</p>
          <p style={{ margin: 0 }}>{sceneName}</p>
          <p style={{ margin: 0 }}>OBS Websocket Connected:</p>
          <p style={{ margin: 0 }}>{`${obsWebsocketConnected.valueOf()}`}</p>
        </div>
      </div>
    </div>
  );
}
