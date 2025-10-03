import { useWebsocket } from "@/app/_components/websocket-provider";
import { useEffect } from "react";

export function useSocketTriggeredFunction(
  path: string,
  func: (data?: unknown) => void,
) {
  const { socket } = useWebsocket();

  useEffect(() => {
    socket.on(path, func);

    return () => {
      socket.off(path, func);
    };
  });
}
