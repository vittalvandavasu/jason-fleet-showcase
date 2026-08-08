import React from 'react';

/**
 * Northwest Haul Rentals brand logo.
 *
 * Uses the official PNG assets in /public/logo/.
 *   - color="white" (default) uses logo-white.png (for dark backgrounds)
 *   - color="black" uses logo-black.png (for light backgrounds)
 *
 * Variants:
 *   - horizontal (default): sized for navbar / inline usage (height 42px)
 *   - hero: much larger for hero decoration
 *   - mark: just the logo image, size configurable
 */
export default function Logo({
  variant = 'horizontal',
  color = 'white',
  className = '',
  height,
}) {
  const src = color === 'black' ? '/logo/logo-black.png' : '/logo/logo-white.png';

  const dims = (() => {
    if (height) return { height };
    switch (variant) {
      case 'hero':
        return { height: '150px' };
      case 'mark':
        return { height: '80px' };
      case 'horizontal':
      default:
        return { height: '48px' };
    }
  })();

  return (
    <img
      src={src}
      alt="Northwest Haul Rentals"
      className={`select-none ${className}`}
      style={{ ...dims, width: 'auto', objectFit: 'contain' }}
      draggable={false}
    />
  );
}
