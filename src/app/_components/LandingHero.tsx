import Image from "next/image";
import { GetStartedCta } from "./GetStartedCta";

export const LandingHero: React.FC = () => {
  return (
    <div className="bg-background pt-24 pb-8 md:pt-32 md:pb-16" id="hero">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="gap-4 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:flex lg:flex-col lg:justify-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-5xl xl:text-6xl dark:text-gray-700">
              <span className="block">Lorem ipsum your</span>
              <span className="text-pop workflow block pb-6">dolor today!</span>
            </h1>
            <p className="text-base font-light text-gray-500 sm:text-xl lg:text-lg xl:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              vel sem leo. Nunc eget tincidunt libero. Pellentesque fringilla
              congue nisi id lobortis. Nullam pharetra orci eros, id interdum
              ipsum sagittis ac.
            </p>
            <div className="mt-4 h-[36px] sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
              <GetStartedCta secondaryText="Start for free now - no credit card required!" variant={"default"} />
            </div>
          </div>
          <div className="relative mt-12 flex items-center justify-center sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0">
            <Image
              priority={true}
              width={409}
              height={409}
              alt=""
              src="/images/landing-hero.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
