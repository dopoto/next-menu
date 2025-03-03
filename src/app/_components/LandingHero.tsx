import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";

export const LandingHero: React.FC = () => {
  return (
    <div className="bg-background pt-24 pb-8 md:pt-32 md:pb-16" id="hero">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className=" lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="gap-4 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:flex lg:flex-col lg:justify-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl dark:text-gray-700">
              <span className="block">Simplify your</span>
              <span className="block text-pop">workflow today</span>
            </h1>
            <p className="text-base font-light text-gray-500   sm:text-xl lg:text-lg xl:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              vel sem leo. Nunc eget tincidunt libero. Pellentesque fringilla
              congue nisi id lobortis. Nullam pharetra orci eros, id interdum
              ipsum sagittis ac.
            </p>
            <div className="mt-4 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
              <Link href="/sign-up">
                {/* className="mt-3 w-full rounded-md border border-transparent bg-indigo-600 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:flex-shrink-0" */}
                <Button>Get started</Button>
              </Link>
              <p className="mt-3 text-sm text-gray-500 italic">
                Start for free now - no credit card required.
              </p>
            </div>
          </div>
          <div className="relative mt-12 items-center justify-center sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none">
            <Image
              width={409}
              height={409}
              alt=""
              src="/images/landing-hero-light.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
