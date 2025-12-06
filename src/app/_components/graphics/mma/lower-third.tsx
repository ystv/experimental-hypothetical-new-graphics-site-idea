import { api } from "@/trpc/react";
import VisibleStateWrapper from "../visible-state-wrapper";
import { motion } from "framer-motion";
import MultiText from "../multi-text";
import TimerWrapper from "../timer-wrapper";
import {
  getMappedPath,
  GraphicsCollectionComponentProps,
} from "@/lib/graphics";

export function MMALowerThird(props: GraphicsCollectionComponentProps) {
  const graphicsCollection = api.graphicsCollections.getPublicState.useQuery({
    graphics_collection_id: props.graphics_collection_id,
  });

  const borderRadius = "15px";

  if (!graphicsCollection.data) return <></>;
  return (
    <VisibleStateWrapper
      path={getMappedPath(
        graphicsCollection.data.path_mapping,
        "visible_states",
        "lower_third",
      )}
      event_id={graphicsCollection.data.event_id}
    >
      {(state) => (
        <motion.div animate={{ opacity: state ? 1 : 0 }}>
          <VisibleStateWrapper
            path={getMappedPath(
              graphicsCollection.data.path_mapping,
              "visible_states",
              "round_display",
            )}
            event_id={graphicsCollection.data.event_id}
          >
            {(roundDisplayVisible) => (
              <>
                <motion.div
                  animate={{ bottom: roundDisplayVisible ? "13%" : "8%" }}
                  style={{
                    position: "absolute",
                    backgroundColor: "#333",
                    width: "10%",
                    height: "5%",
                    bottom: "13%",
                    left: "45%",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <MultiText
                  event_id={graphicsCollection.data.event_id}
                  path={getMappedPath(
                    graphicsCollection.data.path_mapping,
                    "multi_texts",
                    "round_number",
                  )}
                >
                  {(roundNumber) => (
                    <motion.div
                      animate={{ bottom: roundDisplayVisible ? "13%" : "8%" }}
                      style={{
                        position: "absolute",
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: 24,
                        width: "10%",
                        paddingBottom: "0.5%",
                        left: "45%",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      Round {roundNumber.content}
                    </motion.div>
                  )}
                </MultiText>
              </>
            )}
          </VisibleStateWrapper>
          <motion.div
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
          <MultiText
            event_id={graphicsCollection.data.event_id}
            path={getMappedPath(
              graphicsCollection.data.path_mapping,
              "multi_texts",
              "red_fighter",
            )}
          >
            {(multiText) => (
              <motion.div
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
              </motion.div>
            )}
          </MultiText>
          <motion.div
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
          <MultiText
            event_id={graphicsCollection.data.event_id}
            path={getMappedPath(
              graphicsCollection.data.path_mapping,
              "multi_texts",
              "blue_fighter",
            )}
          >
            {(multiText) => (
              <motion.div
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
              </motion.div>
            )}
          </MultiText>
          <motion.div
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
          <VisibleStateWrapper
            path={getMappedPath(
              graphicsCollection.data.path_mapping,
              "visible_states",
              "lower_third_timer",
            )}
            event_id={graphicsCollection.data.event_id}
          >
            {(timerState) => (
              <>
                <motion.div
                  style={{
                    position: "absolute",
                    background:
                      "linear-gradient(90deg, #e34848 0%, #333 25%, #333 75%, #4979d5 100%)",
                    width: "20%",
                    height: "8%",
                    bottom: "5%",
                    left: "40%",
                  }}
                  animate={{
                    opacity: timerState ? 1 : 0,
                  }}
                />
                <TimerWrapper
                  event_id={graphicsCollection.data.event_id}
                  path={getMappedPath(
                    graphicsCollection.data.path_mapping,
                    "timers",
                    "countdown",
                  )}
                >
                  {({ minutes, seconds }) => (
                    <motion.div
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
                      }}
                      animate={{
                        opacity: timerState ? 1 : 0,
                      }}
                    >
                      {minutes.toString().padStart(2, "0")}:
                      {seconds.toString().padStart(2, "0")}
                    </motion.div>
                  )}
                </TimerWrapper>
              </>
            )}
          </VisibleStateWrapper>
        </motion.div>
      )}
    </VisibleStateWrapper>
  );
}
