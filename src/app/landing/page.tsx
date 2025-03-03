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

















