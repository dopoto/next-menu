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
















