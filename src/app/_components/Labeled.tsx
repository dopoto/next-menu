import { ReactNode } from "react";

export function Labeled(props: {label: string, text?: string | ReactNode}) {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight antialiased ">
      <span className="text-tiny truncate uppercase font-semibold text-muted-foreground">{props.label}</span>
      <span className="h-[20px] truncate ">{props.text}</span>
    </div>
  );
}
