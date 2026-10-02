import React, { useState, useMemo } from 'react';
import type { Product } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onSelectProduct,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['all', 'Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Pendants'];
  const collections = ['all', 'The Luna Collection', 'Solstice & Dawn'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isActive) return false;
        if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (selectedCollection !== 'all' && !p.collection.toLowerCase().includes(selectedCollection.toLowerCase())) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }
        if (p.basePrice > maxPrice) return false;
        if (inStockOnly) {
          const totalStock = p.variations.reduce((sum, v) => sum + v.stock, 0);
          if (totalStock <= 0) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
        if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // featured default
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedCollection, searchQuery, maxPrice, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSortBy('featured');
    setInStockOnly(false);
    setSearchQuery('');
    setMaxPrice(10000);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#081d1a] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Banner / Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8c7355]">
            Maison Catalog
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#081d1a] tracking-wide">
            Fine Jewelry
          </h1>
          <p className="text-xs md:text-sm text-[#78716c] font-light">
            Everyday heirlooms designed to be layered, stacked, and treasured forever.
          </p>
        </div>

        {/* Category Pill Tabs Bar (Interactive filter controls) */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-medium transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#081d1a] text-[#c5a880] shadow-sm'
                  : 'bg-white border border-[#ede5d8] text-[#57534e] hover:border-[#081d1a]'
              }`}
            >
              {cat === 'all' ? 'All Jewelry' : cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter & Sorting Controls Bar */}
        <div className="bg-white border border-[#ede5d8] p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Search box inside shop */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c7355]" />
            <input
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fcfaf7] border border-[#ede5d8] rounded-none px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#081d1a]"
            />
          </div>

          {/* Counts & Mobile Filter Trigger */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <span className="text-[#78716c] text-[11px]">
              Showing <strong className="text-[#081d1a] font-mono">{filteredProducts.length}</strong> items
            </span>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 border border-[#ede5d8] text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8c7355]" />
              <span>Filters</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <label className="text-[11px] text-[#78716c] uppercase tracking-wider whitespace-nowrap">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#fcfaf7] border border-[#ede5d8] px-3 py-1.5 text-xs text-[#081d1a] focus:outline-none"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Latest Additions</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar (Desktop) */}
          <aside
            className={`md:col-span-3 space-y-6 bg-white p-5 border border-[#ede5d8] ${
              mobileFilterOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#ede5d8]">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#081d1a]">
                Refine by
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#8c7355] hover:text-[#081d1a] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Collection Filter */}
            <div className="space-y-2">
              <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#78716c]">
                Collection
              </h4>
              <div className="space-y-1.5 text-xs">
                {collections.map((col) => (
                  <label key={col} className="flex items-center gap-2 cursor-pointer text-[#44403c]">
                    <input
                      type="radio"
                      name="collection"
                      checked={selectedCollection.toLowerCase() === col.toLowerCase()}
                      onChange={() => setSelectedCollection(col)}
                      className="accent-[#081d1a]"
                    />
                    <span className="capitalize">{col === 'all' ? 'All Collections' : col}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-2 pt-2 border-t border-[#ede5d8]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="uppercase tracking-wider font-semibold text-[#78716c]">Max Price</span>
                <span className="font-mono font-medium text-[#081d1a]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={10000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#081d1a]"
              />
            </div>

            {/* Stock Availability Toggle */}
            <div className="pt-2 border-t border-[#ede5d8]">
              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span className="text-[#44403c] font-medium">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#081d1a]"
                />
              </label>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="md:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#ede5d8] p-12 text-center space-y-4">
                <p className="font-serif text-xl text-[#081d1a]">No matching jewelry found</p>
                <p className="text-xs text-[#78716c] max-w-sm mx-auto">
                  Try adjusting your filters or price range to explore more pieces from our collection.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-widest font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
