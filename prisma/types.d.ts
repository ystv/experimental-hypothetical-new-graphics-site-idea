import { TGraphicsCollectionMappedPath } from "@/lib/graphics";
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

    type EventTypeTimerSkeleton = {
      name?: string;
      path: string;
      default_duration_seconds?: number;
    }[];

    type EventTypeVisibleStateSkeleton = {
      name?: string;
      path: string;
      default_visible?: boolean;
    }[];

    type EventTypeSocietySkeleton = {
      name?: string;
      path: string;
    }[];

    type EventGraphicsCollectionMapping = {
      multi_texts?: Record<string, TGraphicsCollectionMappedPath>;
      timers?: Record<string, TGraphicsCollectionMappedPath>;
      visible_states?: Record<string, TGraphicsCollectionMappedPath>;
      societies?: Record<string, TGraphicsCollectionMappedPath>;
    };
  }
}
