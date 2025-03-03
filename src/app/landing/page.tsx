"use client";

import {
  Menu,
  BarChart2,
  Zap,
  Clock,
  Users,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  Github,
} from "lucide-react";
import Link from "next/link";
import SvgIcon from "../_components/SvgIcons";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { ThemeSwitch } from "../_components/ThemeSwitch";
import { Testimonials } from "../_components/Testimonials";
import { Pricing } from "../_components/Pricing";
import { FAQ } from "../_components/FAQ";
import { LandingCta } from "../_components/LandingCta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ items={[]} />
      <LandingCta />
      <Footer
        companyName={""}
        tagline={""}
        footerSections={[]}
        contactInfo={{
          email: "",
          phone: "",
          address: "",
        }}
        socialLinks={{
          facebook: undefined,
          twitter: undefined,
          instagram: undefined,
          linkedin: undefined,
          youtube: undefined,
          github: undefined,
        }}
      />
    </div>
  );
}

// types.ts - Shared TypeScript interfaces
export interface NavItem {
  name: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

 




const Navbar: React.FC = () => {
  const navigation: NavItem[] = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="fixed z-10 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                <SvgIcon kind="logo" size={"10"} className="fill-rose-700" />
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <SignedOut>
              <SignInButton>
                <Button className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="ml-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  Sign up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
            <UserButton   userProfileMode="navigation" userProfileUrl="/my" appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "40px", // Set the width of the icon
                  height: "40px", // Set the height of the icon
                },
              }
            }}/>
            </SignedIn>
            <ThemeSwitch />
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="space-y-1 pt-2 pb-3">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 pb-3">
          <div className="flex items-center px-4">
            <a
              href="#"
              className="block rounded-md border border-transparent bg-white px-4 py-2 text-center text-base font-medium text-gray-600 hover:bg-gray-50"
            >
              Log in
            </a>
            <a
              href="#"
              className="ml-4 block rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-base font-medium text-white hover:bg-indigo-700"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero: React.FC = () => {
  return (
    <div className="pt-24 pb-8 md:pt-32 md:pb-16" id="hero">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:flex lg:flex-col lg:justify-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">Simplify your</span>
              <span className="block text-indigo-600">workflow today</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Boost productivity and streamline operations with our intuitive
              platform. Designed for teams of all sizes to collaborate
              efficiently and deliver exceptional results.
            </p>
            <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
              <Link href="/sign-up">
                <Button className="mt-3 w-full rounded-md border border-transparent bg-indigo-600 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:flex-shrink-0">
                  Get started
                </Button>
              </Link>
              <p className="mt-3 text-sm text-gray-500">
                Start for free now - no credit card required.
              </p>
            </div>
          </div>
          <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full overflow-hidden rounded-lg bg-white">
                <img
                  className="w-full"
                  src="/api/placeholder/640/360"
                  alt="Product screenshot"
                />
                <div className="absolute inset-0 flex h-full w-full items-center justify-center">
                  <button className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Advanced Analytics",
      description:
        "Gain deeper insights with our powerful analytics dashboard. Track performance and make data-driven decisions.",
      icon: <BarChart2 className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "Enterprise Security",
      description:
        "Your data security is our priority. Benefit from best-in-class encryption and secure authentication.",
      icon: <Clock className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "Lightning Performance",
      description:
        "Optimized for speed, our platform delivers results instantly, saving you valuable time and resources.",
      icon: <Zap className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "Time-Saving Automation",
      description:
        "Automate repetitive tasks and workflows to increase efficiency and reduce manual workload.",
      icon: <Clock className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "Team Collaboration",
      description:
        "Foster collaboration with tools designed for effective team communication and project management.",
      icon: <Users className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "Global Accessibility",
      description:
        "Access your workspace from anywhere in the world, on any device with internet connection.",
      icon: <Globe className="h-6 w-6 text-indigo-500" />,
    },
  ];

  return (
    <div className="bg-white py-16" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="heading-label">
            Features
          </h2>
          <p className="heading-main">
            A better way to work
          </p>
          <p className="heading-secondary">
            Our platform is packed with powerful features to help your team
            succeed.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative flex flex-col rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};












