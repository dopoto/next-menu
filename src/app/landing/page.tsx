"use client";

import {
  X,
  Menu,
  BarChart2,
  Zap,
  Clock,
  Users,
  Globe,
  Check,
  ChevronUp,
  ChevronDown,
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
import { useState } from "react";
import SvgIcon from "../_components/SvgIcons";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { ThemeSwitch } from "../_components/ThemeSwitch";
import { PageTitle } from "../_components/PageTitle";
import { PageSubtitle } from "../_components/PageSubtitle";
import { Testimonials } from "../_components/Testimonials";
import { Pricing } from "../_components/Pricing";
import { FAQ } from "../_components/FAQ";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
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
          <h2 className="text-base font-semibold tracking-wide text-indigo-600 uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to work
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
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







const CTA: React.FC = () => {
  return (
    <div className="bg-indigo-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl flex flex-col">
          <PageTitle>Ready to dive in?</PageTitle>
          <PageSubtitle>Create a free account now!</PageSubtitle>
          
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Get started
            </a>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <a
              href="#"
              className="bg-opacity-60 hover:bg-opacity-70 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

type FooterLinkItem = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLinkItem[];
};

type FooterProps = {
  companyName: string;
  tagline: string;
  footerSections: FooterSection[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  newsletterEnabled?: boolean;
  legalLinks?: FooterLinkItem[];
  copyrightText?: string;
  logoSrc?: string;
};

const Footer: React.FC<FooterProps> = ({
  companyName,
  tagline,
  footerSections,
  contactInfo,
  socialLinks,
  newsletterEnabled = true,
  legalLinks = [],
  copyrightText,
  logoSrc,
}) => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log("Newsletter subscription submitted");
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={`${companyName} logo`}
                  className="h-10 w-auto"
                />
              ) : (
                <div className="text-xl font-bold text-white">
                  {companyName}
                </div>
              )}
            </div>
            <p className="mb-4 text-gray-400">{tagline}</p>

            {/* Contact Information */}
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-400" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="transition-colors hover:text-blue-400"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-400" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="transition-colors hover:text-blue-400"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-400" />
                <span>{contactInfo.address}</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-blue-500"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-pink-500"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-red-600"
                >
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              )}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="mb-4 text-lg font-semibold text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 transition-colors hover:text-blue-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletterEnabled && (
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Subscribe to our newsletter
              </h3>
              <p className="mb-4 text-gray-400">
                Stay updated with the latest features, news, and more.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full rounded-md bg-gray-800 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our Privacy Policy and consent to
                  receive updates.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-500">
              {copyrightText ??
                `© ${currentYear} ${companyName}. All rights reserved.`}
            </div>

            {/* Legal Links */}
            {legalLinks.length > 0 && (
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-blue-400"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
