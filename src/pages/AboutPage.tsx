import React from 'react';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Leaf } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo.tsx';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#081d1a]">
      {/* Editorial Header */}
      <section className="bg-[#081d1a] text-[#fbf9f5] py-20 px-6 text-center border-b border-[#143e37]">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#c5a880]">
            Maison Heritage
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide leading-tight">
            The Art of Quiet Radiance
          </h1>
          <p className="text-xs sm:text-sm text-[#d1d5db] font-light max-w-xl mx-auto leading-relaxed">
            Founded with an unwavering belief that fine jewelry should celebrate daily chapters, not just reserved occasions.
          </p>
        </div>
      </section>

      {/* Narrative Section with Split Imagery */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden border border-[#ede5d8]">
            <img
              src="/src/assets/images/luna_packaging_story_1790965080289.jpg"
              alt="LUNA packaging and jewelry"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8c7355]">
              Our Provenance
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#081d1a] font-normal leading-snug">
              Sculpted by Master Goldsmiths in Colaba, Mumbai
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed font-light">
              At LUNA Boutique, every pendant, hoop, and eternity band begins as an architectural silhouette. We source only certified 18k solid gold, heavy vermeil, and ethical lab-grown moissanites that capture light with crystalline purity.
            </p>
            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed font-light">
              Our master artisans bring decades of generational bench expertise to every bezel setting, ensuring seamless ergonomics, hypoallergenic security, and lifetime durability.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-widest font-medium hover:bg-[#123833] transition-colors"
              >
                <span>Explore the Creations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Pillars */}
      <section className="bg-[#ede5d8]/50 py-16 border-y border-[#dfd4c3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#081d1a]">
              The LUNA Pillars
            </h3>
            <p className="text-xs text-[#78716c]">Our non-negotiable promises to every patron.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border border-[#ede5d8] space-y-3">
              <Shield className="w-6 h-6 text-[#8c7355]" />
              <h4 className="font-serif text-lg text-[#081d1a]">18k Certified Purity</h4>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Every metal lot is verified for hallmarked purity, hypoallergenic nickel-free wear, and tarnish-resistant lustrous finish.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#ede5d8] space-y-3">
              <Sparkles className="w-6 h-6 text-[#8c7355]" />
              <h4 className="font-serif text-lg text-[#081d1a]">Conflict-Free Solitaires</h4>
              <p className="text-xs text-[#57534e] leading-relaxed">
                We champion laboratory cultivated moissanites and cultivated crystals that match or exceed D-color and VVS clarity standards.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#ede5d8] space-y-3">
              <Leaf className="w-6 h-6 text-[#8c7355]" />
              <h4 className="font-serif text-lg text-[#081d1a]">Kinder Packaging</h4>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Our signature emerald presentation boxes and ribbons use 100% recycled cotton papers and biodegradable vegetable dyes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
