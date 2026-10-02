import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

interface PromotionalBannerProps {
  onExplore: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onExplore }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#071916] via-[#0b2824] to-[#071916] text-[#fbf9f5] border-y border-[#143e37] py-14 md:py-20">
      {/* Decorative subtle ambient glows */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c5a880]/30 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Left: Brand Monogram */}
        <div className="flex flex-col items-center md:items-start space-y-2 md:border-r md:border-[#1c4d44] md:pr-14">
          <BrandLogo light={true} className="scale-110" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880]/80">
            Fine Jewelry Studio
          </span>
        </div>

        {/* Center: Headline Quote */}
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c5a880] mb-2 font-medium">
            Maison Philosophy
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#fbf9f5] tracking-wide font-light leading-snug">
            Jewelry that speaks without saying a word.
          </h2>
        </div>

        {/* Right: CTA Action */}
        <div>
          <button
            onClick={onExplore}
            className="group inline-flex items-center gap-2.5 px-6 py-3 border border-[#c5a880] text-[#c5a880] hover:bg-[#c5a880] hover:text-[#081d1a] transition-all text-xs uppercase tracking-[0.2em] font-medium"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
