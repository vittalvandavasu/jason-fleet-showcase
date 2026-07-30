import React from 'react';

/**
 * Northwest Haul Rentals brand logo — SVG rendition of the actual trailer decal.
 * Mountain silhouette (Mt. Rainier-style) + "Northwest" wordmark.
 *
 * Variants:
 *   - variant="horizontal" (default): mountain icon + text stacked to the right
 *   - variant="icon": just the mountain + NHR abbreviation (for navbar squares)
 *   - variant="stacked": mountain on top, text below (for hero / footer)
 */
export default function Logo({
  variant = 'horizontal',
  color = '#ffffff',
  accent = '#f59e0b',
  className = '',
  showLLC = false,
}) {
  // Mountain path — three-peak silhouette echoing the trailer decal
  const Mountain = ({ size = 40 }) => (
    <svg
      viewBox="0 0 120 70"
      width={size}
      height={(size * 70) / 120}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* base range */}
      <path
        d="M2 62 L22 42 L34 52 L48 30 L60 46 L72 22 L86 44 L98 34 L118 62 Z"
        fill={color}
      />
      {/* snow caps */}
      <path
        d="M48 30 L52 34 L56 30 L60 34 L56 38 L54 36 L50 40 L46 36 Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M72 22 L76 28 L74 30 L78 34 L74 38 L70 34 L68 30 Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center flex-col ${className}`} aria-label="Northwest Haul Rentals">
        <Mountain size={26} />
        <span
          className="font-display leading-none tracking-wide"
          style={{ color, fontSize: '13px', letterSpacing: '0.06em', marginTop: 2 }}
        >
          NHR
        </span>
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center ${className}`} aria-label="Northwest Haul Rentals">
        <Mountain size={72} />
        <div className="mt-2 text-center leading-none">
          <div
            className="font-display"
            style={{ color, fontSize: '2rem', letterSpacing: '0.01em' }}
          >
            Northwest
          </div>
          <div
            className="font-display mt-1"
            style={{ color, fontSize: '0.9rem', letterSpacing: '0.28em' }}
          >
            HAUL RENTALS{showLLC ? ' LLC' : ''}
          </div>
        </div>
      </div>
    );
  }

  // horizontal (default)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} aria-label="Northwest Haul Rentals">
      <Mountain size={42} />
      <div className="flex flex-col leading-none">
        <span
          className="font-display"
          style={{ color, fontSize: '1.4rem', letterSpacing: '0.005em' }}
        >
          Northwest
        </span>
        <span
          className="font-display mt-0.5"
          style={{ color: accent, fontSize: '0.65rem', letterSpacing: '0.32em' }}
        >
          HAUL RENTALS{showLLC ? ' LLC' : ''}
        </span>
      </div>
    </div>
  );
}
