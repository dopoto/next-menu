import { FrownIcon } from "lucide-react";
import { type ReactNode } from "react";
import { Badge } from "~/components/ui/badge";

type Section = {
  title: string;
  content: ReactNode | string;
};

export function ErrorCard(props: { title: string; sections: Section[] }) {
  return (
    <div className="mb-4 flex flex-col rounded-xl border-1 border-dashed border-red-300 bg-red-50/20 p-4 text-xs">
      <div className="flex flex-col justify-center gap-1">
        <div className="flex   justify-center">
          <FrownIcon strokeWidth={2} className="size-8 stroke-red-500" />
        </div>
        <div className="text-center text-sm text-red-500 uppercase">
          {props.title}
        </div>
      </div>
      {props.sections.map((section) => (
        <>
          <Badge
            variant={"outline"}
            className="mt-5 mr-1 mb-1 w-[70px] gap-0 border-dashed border-red-500 text-red-500"
          >
            {section.title}
          </Badge>
          <div className="max-w-md">{section.content}</div>
        </>
      ))}
    </div>
  );
}
