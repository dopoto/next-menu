import { type ReactNode } from "react";

export function PageTitle(props: { textColor?: string; children?: ReactNode }) {
  const { textColor = "default", children } = props;
  return (
    <span
      className={`text-3xl font-semibold tracking-tighter ${textColor === "default" ? "dark:text-gray-200" : textColor}`}
    >
      {children}
    </span>
  );
}
