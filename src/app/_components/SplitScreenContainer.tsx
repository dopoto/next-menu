import { type ReactNode } from "react";
import { PageSubtitle } from "./PageSubtitle";
import { PublicTopNav } from "./PublicTopNav";
import { PageTitle } from "./PageTitle";

export function SplitScreenContainer(props: {
  title: string;
  subtitle: string;
  mainComponent: ReactNode;
  secondaryComponent?: ReactNode;
}) {
  return (
    <div className="flex h-full w-full min-w-0 flex-auto flex-col items-center bg-amber-50 sm:flex-row sm:justify-center">
      <div className="flex h-full w-full flex-col flex-nowrap gap-6 px-4 py-2 sm:h-auto sm:w-auto  md:min-w-[650px] sm:p-6 md:p-6">
        <div className="py-6">
          <PublicTopNav />
        </div>
        <div className="flex flex-col flex-nowrap">
          <PageTitle>{props.title}</PageTitle>
          <PageSubtitle>{props.subtitle}</PageSubtitle>
        </div>

        {props.secondaryComponent}

        {props.mainComponent}
      </div>
      <div className="relative hidden h-full flex-auto items-center justify-center overflow-hidden bg-blue-900 p-16 lg:flex lg:px-28">
        TODO 
      </div>
    </div>
  );
}
