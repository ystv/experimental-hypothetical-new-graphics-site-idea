import { TGraphicsCollection } from "..";
import { ColorBars } from "@/app/_components/graphics/util/bars";

export const UtilGraphics: TGraphicsCollection = {
  slug: "util",
  name: "Utilities",
  description: "A collection of graphics debugging",
  components: [ColorBars],
  data: {
    visible_states: {
      bars: {
        name: "Color Bars",
      },
    },
  },
};
