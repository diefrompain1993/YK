import type { SVGProps } from "react";

type NfcTagIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

/** Round NFC marker: reader point plus two clean signal waves for small sizes. */
export function NfcTagIcon({
  size = 24,
  strokeWidth = 1.75,
  ...props
}: NfcTagIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="8.65" />
      <circle cx="8.6" cy="12" r="1.05" fill="currentColor" stroke="none" />
      <path d="M11.15 9.9a2.9 2.9 0 0 1 0 4.2" />
      <path d="M13.05 8.15a5.15 5.15 0 0 1 0 7.7" />
    </svg>
  );
}
