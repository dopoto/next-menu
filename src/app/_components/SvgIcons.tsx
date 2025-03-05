import { type SVGProps } from "react";

// Icons taken from: https://simpleicons.org/

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

export const SvgIconKind = {
  logo: Logo,
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
