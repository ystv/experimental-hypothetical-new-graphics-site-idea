"use client";

import { motion } from "framer-motion";
import VisibleStateWrapper from "../visible-state-wrapper";
import { flattenRecord } from "@/lib/graphics";
import { useGraphicsCollection } from "../../graphics-collection-provider";

export function ColorBars() {
  const graphicsCollection = useGraphicsCollection();

  return (
    <VisibleStateWrapper
      path={
        flattenRecord(graphicsCollection?.path_mapping.visible_states).find(
          (v) => v.key === "bars",
        )?.value.mapped_path ?? "bars"
      }
    >
      {(state) => (
        <motion.div
          animate={{ opacity: state ? 1 : 0 }}
          style={{
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
        >
          <StandaloneColorBars />
        </motion.div>
      )}
    </VisibleStateWrapper>
  );
}

export function StandaloneColorBars() {
  return (
    <motion.div
      style={{
        width: "100%",
        height: "100%",
        zIndex: 2,
        backgroundImage: "url(/_assets/util/bars.svg)",
        backgroundSize: "100vw 100vh",
      }}
    />
  );
}
