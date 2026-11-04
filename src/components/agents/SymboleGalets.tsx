import type { CSSProperties } from "react";

/**
 * Le symbole Galets, seul : les six tracés copiés tels quels de src/assets/logo.svg (logo du
 * 2 novembre, clé de voûte carrée), sans le nom. Jamais redessiné ; seule la couleur suit
 * `currentColor` (règle de DESIGN.md : une seule couleur).
 */
export function SymboleGalets({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="10.4623 6.9985 154.093 173.714"
      className={className}
      style={style}
      aria-hidden
      focusable="false"
    >
      <g strokeWidth="15.67" strokeLinejoin="round">
        <path
          transform="translate(67.7999 14.8335)"
          d="M0 0 L62.423 15.9125 L30.8734 52.5949 L2.8634 51.9975 Z"
          fill="currentColor"
          stroke="currentColor"
        />
        <path
          transform="translate(118.4916 44.2009)"
          d="M34.5175 0 L0.101 39.9213 L0 70.2643 L38.2286 66.5335 Z"
          fill="currentColor"
          stroke="currentColor"
        />
        <path
          transform="translate(71.125 90.875)"
          d="M0 0 L23.75 0 L23.75 23.75 L0 23.75 Z"
          fill="currentColor"
          stroke="currentColor"
        />
        <path
          transform="translate(25.6218 137.0117)"
          d="M67.5487 1.4661 L0.8551 0 L0 30.9357 L22.7217 35.8653 L63.9536 30.9357 Z"
          fill="currentColor"
          stroke="currentColor"
        />
        <path
          transform="translate(18.2973 16.946)"
          d="M28.5979 95.7061 L7.6005 91.5595 L0 46.0841 L3.2973 8.2147 L26.0407 0 L29.5992 37.6614 Z"
          fill="currentColor"
          stroke="currentColor"
        />
        <path
          transform="translate(113.3655 137.2606)"
          d="M0.3845 3.3926 L40.2526 0 L37.3038 21.1524 L1.6599 24.9536 L0 19.0657 Z"
          fill="currentColor"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
}
