import React from 'react';

interface BrandLogoProps {
  className?: string;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', light = true }) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <span
        className={`font-serif tracking-[0.22em] text-2xl md:text-3xl font-light leading-none ${
          light ? 'text-[#fbf9f5]' : 'text-[#081d1a]'
        }`}
        style={{ letterSpacing: '0.25em' }}
      >
        LUNA
      </span>
      <span
        className={`text-[8px] md:text-[9px] font-sans tracking-[0.45em] uppercase mt-1 leading-none ${
          light ? 'text-[#c5a880]' : 'text-[#8c7355]'
        }`}
      >
        BOUTIQUE
      </span>
    </div>
  );
};
