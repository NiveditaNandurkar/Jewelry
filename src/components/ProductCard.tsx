import React, { useState } from 'react';
import type { Product, ProductVariation } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const defaultVar = product.variations.find((v) => v.isDefault) || product.variations[0];
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation>(defaultVar);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const currentPrice = selectedVariation?.price || product.basePrice;
  const isOutOfStock = (selectedVariation?.stock ?? 0) <= 0;
  const displayImage = selectedVariation?.imageUrl || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      showToast(`Selected finish is currently out of stock`, 'error');
      return;
    }
    addToCart(product, selectedVariation, 1);
    showToast(`Added ${product.name} (${selectedVariation.colorName}) to your bag`);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col bg-white border border-[#f0eae0] rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#c5a880]/40"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-square bg-[#f8f5ee] overflow-hidden">
        <img
          src={displayImage}
          alt={`${product.name} in ${selectedVariation?.colorName || 'Gold'}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="bg-[#081d1a]/85 backdrop-blur-sm text-[#c5a880] text-[9px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-none">
              Signature
            </span>
          )}
          {isOutOfStock ? (
            <span className="bg-red-900/90 text-red-200 text-[9px] uppercase tracking-widest font-medium px-2 py-0.5">
              Sold Out
            </span>
          ) : (selectedVariation?.stock ?? 10) <= 5 ? (
            <span className="bg-amber-900/80 text-amber-200 text-[9px] uppercase tracking-widest font-medium px-2 py-0.5">
              Low Stock
            </span>
          ) : null}
        </div>

        {/* Hover Quick Action Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-between gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 bg-white/95 text-[#081d1a] py-2 px-3 text-[10px] uppercase tracking-widest font-semibold hover:bg-[#c5a880] hover:text-[#081d1a] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2 transition-colors ${
              isOutOfStock
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-[#081d1a] text-[#c5a880] hover:bg-[#c5a880] hover:text-[#081d1a]'
            }`}
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col items-center text-center flex-1 justify-between bg-[#fcfaf7]">
        <div>
          {/* Color Variation Swatches */}
          {product.variations.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 mb-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              {product.variations.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariation(v);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedVariation?.id === v.id
                      ? 'ring-1 ring-offset-1 ring-[#081d1a] scale-110'
                      : 'opacity-70 hover:opacity-100 border-black/20'
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  title={`${v.colorName} (${v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'})`}
                  aria-label={v.colorName}
                />
              ))}
            </div>
          )}

          {/* Product Name in refined uppercase serif */}
          <h3 className="font-serif text-sm tracking-[0.12em] uppercase text-[#081d1a] font-normal leading-snug group-hover:text-[#8c7355] transition-colors">
            {product.name}
          </h3>

          <p className="text-[10px] uppercase tracking-wider text-[#78716c] mt-0.5">
            {selectedVariation?.colorName || product.category}
          </p>
        </div>

        {/* Pricing */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-xs text-[#78716c] line-through font-mono tabular-nums">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-medium text-[#081d1a] font-mono tabular-nums">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-[#081d1a] font-mono tabular-nums">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
