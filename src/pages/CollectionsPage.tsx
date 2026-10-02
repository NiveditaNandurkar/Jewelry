import React from 'react';
import type { Product, Collection } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ArrowRight } from 'lucide-react';

interface CollectionsPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateShopWithCollection: (collectionName: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  products,
  onSelectProduct,
  onNavigateShopWithCollection,
}) => {
  const lunaProducts = products.filter((p) => p.collection === 'The Luna Collection');
  const solsticeProducts = products.filter((p) => p.collection.includes('Solstice'));

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#081d1a] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8c7355]">
            Curated Chapters
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#081d1a] tracking-wide">
            Signature Collections
          </h1>
          <p className="text-xs md:text-sm text-[#78716c] font-light">
            Distinctive design expressions anchored in gold, light, and understated balance.
          </p>
        </div>

        {/* Collection 1: The Luna Collection */}
        <section className="space-y-8">
          <div className="relative aspect-[21/9] sm:aspect-[16/6] rounded-xs overflow-hidden border border-[#ede5d8]">
            <img
              src="/src/assets/images/luna_hero_model_1790965022091.jpg"
              alt="The Luna Collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-8 sm:p-14">
              <div className="max-w-md space-y-3 text-[#fbf9f5]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-semibold">
                  Chapter I · Archival Signature
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light">The Luna Collection</h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light">
                  Designed for moments that matter. Featuring our signature solitaire necklaces, pavé huggies, and eternity stackers.
                </p>
                <button
                  onClick={() => onNavigateShopWithCollection('The Luna Collection')}
                  className="inline-flex items-center gap-2 pt-2 text-xs uppercase tracking-widest text-[#c5a880] hover:text-white font-medium"
                >
                  <span>Explore Full Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lunaProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>

        {/* Collection 2: Solstice & Dawn */}
        <section className="space-y-8">
          <div className="relative aspect-[21/9] sm:aspect-[16/6] rounded-xs overflow-hidden border border-[#ede5d8]">
            <img
              src="/src/assets/images/luna_packaging_story_1790965080289.jpg"
              alt="Solstice and Dawn"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#081d1a]/85 via-[#081d1a]/50 to-transparent flex items-center p-8 sm:p-14">
              <div className="max-w-md space-y-3 text-[#fbf9f5]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-semibold">
                  Chapter II · Radiant Daylight
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light">Solstice & Dawn</h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light">
                  Sculptural cascading drops, Akoya freshwater pearls, and luminous golden horizons designed to catch early light.
                </p>
                <button
                  onClick={() => onNavigateShopWithCollection('Solstice & Dawn')}
                  className="inline-flex items-center gap-2 pt-2 text-xs uppercase tracking-widest text-[#c5a880] hover:text-white font-medium"
                >
                  <span>Explore Full Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solsticeProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
