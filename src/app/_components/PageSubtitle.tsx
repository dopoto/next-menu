import { type ReactNode } from "react";

export function PageSubtitle(props: { children?: ReactNode }) {
  return (
    <span className="text-xl font-light tracking-tighter">
      {props.children}
    </span>
  );
}
