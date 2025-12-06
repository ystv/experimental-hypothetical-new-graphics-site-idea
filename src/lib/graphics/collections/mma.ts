import { MMALowerThird } from "@/app/_components/graphics/mma/lower-third";
import { TGraphicsCollection } from "..";

export const MMAGraphics: TGraphicsCollection = {
  slug: "mma",
  name: "MMA",
  description:
    "A collection of graphics for 'red corner blue corner' fights like MMA or boxing",
  components: [MMALowerThird],
  data: {
    multi_texts: {
      red_fighter: {
        name: "Red Fighter",
      },
      blue_fighter: {
        name: "Blue Fighter",
      },
      round_number: {
        name: "Round Number",
      },
    },
    timers: {
      countdown: {
        name: "Round Countdown",
      },
    },
    visible_states: {
      lower_third: {
        name: "Lower Third",
      },
      round_display: {
        name: "Round Display",
      },
      lower_third_timer: {
        name: "Lower Third Timer",
      },
    },
  },
};
