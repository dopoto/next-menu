import { type SVGProps } from "react";

// Icons taken from: https://simpleicons.org, https://www.svgrepo.com

export function Logo(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...svgProps}
    >
      <path  d="M5.89 2.227a.28.28 0 0 1 .266.076l5.063 5.062c.54.54.509 1.652-.031 2.192l8.771 8.77c1.356 1.355-.36 3.097-1.73 1.728l-8.772-8.77c-.54.54-1.651.571-2.191.031l-5.063-5.06c-.304-.304.304-.911.608-.608l3.714 3.713L7.59 8.297 3.875 4.582c-.304-.304.304-.911.607-.607l3.715 3.714 1.067-1.066L5.549 2.91c-.228-.228.057-.626.342-.683ZM12 0C5.374 0 0 5.375 0 12s5.374 12 12 12c6.625 0 12-5.375 12-12S18.625 0 12 0Z" />
    </svg>
  );
}

export function ArrowDoodle(svgProps: SVGProps<SVGSVGElement>) {
  return (    
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 91 91"
    {...svgProps}
  >
    <path
      d="M11.5 54.9C17.6 59 24.2 63.1 29.8 68c2.9 2.5 5.5 5.3 7.7 8.5 2.1 3.2 3.3 7 5.6 10.1 3.2 4.3 9 2.9 10.1-2 7.4-11.4 16.5-24.1 27-32.5 1.9-1.5-.5-4.4-2.5-3.3-9.5 5.6-17.5 12.1-24.5 19.9.2-7.7.5-15.5.6-23.2l.3-20.8c.1-5.7 1.2-11.8.5-17.5-.7-6.8-12.1-9.9-13.2-1.8-1.7 12.5.3 26.4.5 39 .1 6.6.4 13.2.6 19.8-1.3-1.1-2.6-2.1-3.8-3-7.6-5.6-15.8-9.4-24.9-11.6-3.3-.8-5 3.4-2.3 5.3z"
      className="st0"
    />
  </svg>
  );
}

export const SvgIconKind = {
  logo: Logo,
  arrowDoodle: ArrowDoodle
};

type SvgIconProps = {
  kind: keyof typeof SvgIconKind;
  /**
   * A valid Tailwind h-* value.
   * @see https://tailwindcss.com/docs/height.
   */
  size?: string;
  className?: string;
};

const SvgIcon = ({ kind, size = "8", className }: SvgIconProps) => {
  const Icon = SvgIconKind[kind];

  return (
    <>
      <span className="sr-only">{kind}</span>
      <Icon className={`${className} h- h-${size} w-${size}`} />
    </>
  );
};

export default SvgIcon;
