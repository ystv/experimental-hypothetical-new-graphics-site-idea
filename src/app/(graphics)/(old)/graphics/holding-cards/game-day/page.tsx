"use client";

import { useElementSize } from "@mantine/hooks";
import "./hex-grid.css";

export default function GameDayHoldingPage() {
  const { ref } = useElementSize();

  return (
    <svg viewBox="0 0 100 100" width={"100vw"} height={"100vh"} ref={ref}>
      <defs>
        <g id="pod">
          <polygon
            stroke="#000000"
            strokeWidth="0.5"
            points="5,-9 -5,-9 -10,0 -5,9 5,9 10,0"
          />
        </g>
      </defs>

      <g className="pod-wrap">
        <use xlinkHref="#pod" transform="translate(50, 41)" />
        <use xlinkHref="#pod" transform="translate(35, 50)" />
        <use xlinkHref="#pod" transform="translate(65, 50)" />
        <use xlinkHref="#pod" transform="translate(50, 59)" />
      </g>
    </svg>
  );
}
