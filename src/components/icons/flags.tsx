import type { SVGProps } from 'react'

interface FlagProps extends SVGProps<SVGSVGElement> {
  className?: string
}

/**
 * French flag icon (blue, white, red vertical stripes)
 */
export function FrenchFlag({ className, ...props }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3 2"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect width="1" height="2" fill="#002654" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#CE1126" />
    </svg>
  )
}

/**
 * British flag icon (Union Jack)
 */
export function BritishFlag({ className, ...props }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Blue background */}
      <clipPath id="ukClip">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="ukDiag">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#ukClip)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath="url(#ukDiag)"
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}
