import { type ReactNode } from "react";
import { PageSubtitle } from "./PageSubtitle";
import { PublicTopNav } from "./PublicTopNav";
import { PageTitle } from "./PageTitle";
import { ThemeSwitch } from "./ThemeSwitch";
 

export function SplitScreenContainer(props: {
  title: string;
  subtitle: string;
  mainComponent: ReactNode;
  secondaryComponent?: ReactNode;
  sideHeroComponent?: ReactNode;
}) {
  return (
    <div className="flex min-h-full w-full min-w-0 flex-auto flex-col bg-amber-50 dark:bg-[#202027] sm:flex-row sm:justify-center">
      <div id="mainContent" className="flex h-full w-full flex-col flex-nowrap gap-6 px-4 py-2 sm:h-auto sm:w-auto sm:p-6 md:min-w-[450px] md:p-6 relative">
        <div className="py-6">
          <PublicTopNav />
        </div>
        <div className="flex flex-col flex-nowrap">
          <PageTitle>{props.title}</PageTitle>
          <PageSubtitle>{props.subtitle}</PageSubtitle>
        </div>

        {props.secondaryComponent}

        {props.mainComponent}

        <footer className="mt-auto pt-6 flex flex-row text-xs text-gray-400">
          {/* TODO actual ver */}
          <div>v0.0.24</div>          
          <div className="mt-auto ml-auto"><ThemeSwitch /></div>          
        </footer>
      </div>
      <div className="relative hidden h-auto min-h-screen flex-auto items-center justify-center overflow-hidden bg-blue-900 p-16 lg:flex lg:px-28">
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            className="opacity-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23"></circle>
            <circle r="234" cx="790" cy="491"></circle>
          </g>
        </svg>
        {props.sideHeroComponent}
      </div>
    </div>
  );
}
