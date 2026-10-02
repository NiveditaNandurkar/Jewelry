import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { TrustBadges } from '../components/TrustBadges.tsx';
import { PromotionalBanner } from '../components/PromotionalBanner.tsx';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (tab: string, param?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, onSelectProduct, onNavigate }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter Luna collection products for featured row
  const featuredProducts = products.filter((p) => p.isFeatured || p.collection === 'The Luna Collection');

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#081d1a]">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#081d1a] text-[#fbf9f5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Headline & CTA */}
            <div className="lg:col-span-6 space-y-6 z-10">
              <div className="inline-flex items-center gap-2">
                <span className="h-[1px] w-8 bg-[#c5a880]" />
                <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#c5a880]">
                  Fine Jewelry
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide leading-[1.08] text-white">
                TIMELESS.<br />
                EFFORTLESSLY<br />
                YOURS.
              </h1>

              <p className="text-sm md:text-base text-[#d1d5db] font-light max-w-md leading-relaxed">
                Elegant pieces for every chapter of your story. Handcrafted in 18k solid gold, lustrous pearls, and ethically sourced gems.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="group inline-flex items-center gap-3 px-8 py-3.5 border border-[#c5a880] text-xs uppercase tracking-[0.25em] text-[#c5a880] hover:bg-[#c5a880] hover:text-[#081d1a] transition-all duration-300 font-medium cursor-pointer shadow-lg"
                >
                  <span>Discover the Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right: Hero Image Portrait */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-xs overflow-hidden shadow-2xl border border-[#143e37]">
                <img
                  src="/src/assets/images/luna_hero_model_1790965022091.jpg"
                  alt="LUNA Fine Jewelry Campaign"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081d1a]/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTION — THE LUNA COLLECTION */}
      <section className="py-20 bg-[#fcf9f5] border-b border-[#ede5d8]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="h-[1px] w-6 bg-[#8c7355]" />
              <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8c7355]">
                Featured Collection
              </p>
              <span className="h-[1px] w-6 bg-[#8c7355]" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#081d1a] font-normal tracking-wide">
              THE LUNA COLLECTION
            </h2>
            <p className="text-xs md:text-sm text-[#78716c] font-light">
              Designed for moments that matter.
            </p>
          </div>

          {/* Carousel Viewport with Side Arrows */}
          <div className="relative group">
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#ede5d8] text-[#081d1a] shadow-md flex items-center justify-center hover:bg-[#081d1a] hover:text-white transition-all focus:outline-none"
              aria-label="Previous jewelry"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => scrollCarousel('right')}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#ede5d8] text-[#081d1a] shadow-md flex items-center justify-center hover:bg-[#081d1a] hover:text-white transition-all focus:outline-none"
              aria-label="Next jewelry"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth no-scrollbar snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[270px] sm:w-[290px] md:w-[310px] shrink-0 snap-start"
                >
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom link to full catalog */}
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs uppercase tracking-[0.2em] font-semibold text-[#081d1a] hover:text-[#8c7355] border-b border-[#081d1a] pb-1 transition-colors"
            >
              View All 18k Jewelry →
            </button>
          </div>
        </div>
      </section>

      {/* 3. BRAND STORY SECTION (Split View) */}
      <section className="bg-[#ede5d8] border-b border-[#dfd4c3]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Packaging Image */}
          <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto min-h-[380px] lg:min-h-[520px]">
            <img
              src="/src/assets/images/luna_packaging_story_1790965080289.jpg"
              alt="LUNA Boutique Luxury Unboxing Packaging"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Story Editorial Panel */}
          <div className="lg:col-span-6 p-10 sm:p-14 lg:p-20 flex flex-col justify-center items-start space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8c7355]">
                Our Story
              </span>
              <span className="h-[1px] w-8 bg-[#8c7355]" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-[#081d1a] leading-tight">
              MADE TO BE<br />
              REMEMBERED
            </h2>

            <p className="text-sm md:text-base text-[#44403c] leading-relaxed max-w-lg font-light">
              Thoughtfully designed pieces created to complement your everyday elegance. We believe jewelry should be both an intimate daily signature and a lasting heirloom—crafted with meticulous hand-finishing, ethical provenance, and timeless restraint.
            </p>

            <button
              onClick={() => onNavigate('about')}
              className="group inline-flex items-center gap-2.5 px-7 py-3 bg-[#081d1a] text-[#fbf9f5] hover:bg-[#123833] transition-colors text-xs uppercase tracking-[0.2em] font-medium shadow-md"
            >
              <span>Our Story</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. PROMOTIONAL SILK BANNER */}
      <PromotionalBanner onExplore={() => onNavigate('shop')} />

      {/* 5. TRUST BADGES */}
      <TrustBadges />
    </div>
  );
};
