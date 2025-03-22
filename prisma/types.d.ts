import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace PrismaJson {
    type LayerStyle = DetailedHTMLProps<
      HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;

    type EventTypeMultiTextSkeleton = {
      name?: string;
      path: string;
      default_options?: string[];
    }[];
  }
}
