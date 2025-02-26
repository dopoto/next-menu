import { type ReactNode } from "react";

export function PageSubtitle(props: { children?: ReactNode }) {
  return (
    <span className="text-xl font-light tracking-tight text-gray-600  dark:text-gray-400">
      {props.children}
    </span>
  );
}
