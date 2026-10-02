import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import type { Product } from '../types/index.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" />

      <div className="relative min-h-screen flex items-start justify-center pt-20 px-4 sm:px-6">
        <div className="relative w-full max-w-2xl bg-[#081d1a] border border-[#164740] rounded-sm shadow-2xl p-6 text-[#fbf9f5]">
          <div className="flex items-center justify-between border-b border-[#123833] pb-4">
            <div className="flex items-center gap-3 flex-1">
              <Search className="w-5 h-5 text-[#c5a880]" />
              <input
                type="text"
                autoFocus
                placeholder="Search necklaces, earrings, rings, gold finishes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-base sm:text-lg text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Category Suggestions */}
          {!query && (
            <div className="py-6">
              <p className="text-[11px] uppercase tracking-widest text-[#c5a880] mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['The Lumi Necklace', 'Seren Hoops', 'Elys Ring', 'Vera Bracelet', '18k Gold', 'Pearls'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 bg-[#0f2e29] hover:bg-[#164740] text-slate-300 hover:text-[#c5a880] transition-colors rounded-sm border border-[#1b5046]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Results */}
          {query && (
            <div className="pt-4 max-h-[60vh] overflow-y-auto space-y-2">
              {loading ? (
                <p className="text-xs text-slate-400 py-4 text-center">Searching boutique collection...</p>
              ) : results.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No jewelry matching "{query}". Try exploring Necklaces, Earrings, or Rings.
                </p>
              ) : (
                results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-4 p-2.5 hover:bg-[#0e2a25] cursor-pointer transition-colors rounded border border-transparent hover:border-[#1a4a42]"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded bg-[#051412]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm text-[#fbf9f5] truncate">{product.name}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">{product.category} · {product.collection}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-medium text-[#c5a880] tabular-nums">
                        ₹{product.basePrice.toLocaleString('en-IN')}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto mt-1" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
