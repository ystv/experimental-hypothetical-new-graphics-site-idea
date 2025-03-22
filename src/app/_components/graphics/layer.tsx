import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface LayerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  zIndex?: number;
}

export default function Layer(props: LayerProps) {
  const { zIndex, children, style, ...divProps } = props;

  return (
    <div
      {...divProps}
      style={{ zIndex: zIndex, position: "absolute", ...style }}
    >
      {children}
    </div>
  );
}
