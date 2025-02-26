import { type ReactNode } from "react";

export function PageTitle(props: { children?: ReactNode }) {
  return (
    <span className="text-3xl font-semibold tracking-tighter dark:text-gray-200">
      {props.children}
    </span>
  );
}
