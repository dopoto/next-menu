import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import SvgIcon from "../../_components/SvgIcons";
import { ThemeSwitch } from "../../_components/ThemeSwitch";
import { APP_CONFIG } from "~/app/_config/app-config";
import React from "react";
import { AppVersion } from "~/app/_components/AppVersion";
import { ROUTES } from "~/lib/routes";

const currentYear = new Date().getFullYear();

//TODO
const tagline = "Lorem ipsum doloret";
const phone = "01234";
const address = "01234";

export function LandingFooter() {
  return (
    <footer className="bg-background">
      {/* Main Footer Section */}
      <div className="bg-background mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center">
              <Link href={ROUTES.home}>
                <SvgIcon
                  kind="logo"
                  size={"10"}
                  className="fill-black dark:fill-white"
                />
              </Link>
            </div>
            <p className="mb-4 text-gray-400">{tagline}</p>

            {/* Contact Information */}
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-400" />
                <a
                  href={`mailto:${APP_CONFIG.contactEmail}`}
                  className="transition-colors hover:text-blue-400"
                >
                  {APP_CONFIG.contactEmail}
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-400" />
                <a
                  href={`tel:${phone}`}
                  className="transition-colors hover:text-blue-400"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-400" />
                <span>{address}</span>
              </li>
            </ul>

            {/* Social Links */}
            {/* <div className="mt-6 flex space-x-4">
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
            </div> */}
          </div>

          {/* Footer Sections */}
          {/* {footerSections.map((section, index) => (
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
          ))} */}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-border bg-background border-t">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm">
              <AppVersion />
              {`© ${currentYear} All rights reserved.`}
            </div>
            <div className="ml-auto">
              <ThemeSwitch />
            </div>

            {/* Legal Links */}
            {/* {legalLinks.length > 0 && (
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
            )} */}
          </div>
        </div>
      </div>
    </footer>
  );
}
