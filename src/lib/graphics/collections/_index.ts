import { type TGraphicsCollection } from "..";
import { MMAGraphics } from "./mma";
import { UtilGraphics } from "./util";

export * from "./mma";
export * from "./util";

export const GraphicsCollections = {
  MMA: MMAGraphics,
  UTIL: UtilGraphics,
} satisfies Record<string, TGraphicsCollection>;
