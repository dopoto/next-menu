import { PageSubtitle } from "./PageSubtitle";
import { PageTitle } from "./PageTitle";
import { GetStartedCta } from "./GetStartedCta";

export const LandingCta: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-950 via-gray-700 to-gray-950">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="dots-pattern"
              x="0"
              y="7"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pattern)" />
        </svg>
      </div>
      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-14">
        <h2 className="flex flex-col text-3xl font-extrabold tracking-tight md:text-4xl">
          <PageTitle textColor="text-white">Ready to dive in?</PageTitle>
          <PageSubtitle textColor="text-white">
            {"Let's get started!"}
          </PageSubtitle>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <GetStartedCta variant={"outline"} />
        </div>
      </div>
    </div>
  );
};
