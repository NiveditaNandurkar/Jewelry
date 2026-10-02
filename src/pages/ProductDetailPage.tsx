import React, { useState, useEffect } from 'react';
import type { Product, ProductVariation } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ZoomIn,
  Plus,
  Minus,
  CheckCircle,
  Share2
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (tab: string, param?: any) => void;
  onCheckoutInstant?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onCheckoutInstant,
}) => {
  const defaultVar = product.variations.find((v) => v.isDefault) || product.variations[0];
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation>(defaultVar);
  const [selectedImage, setSelectedImage] = useState<string>(
    selectedVariation?.imageUrl || product.images[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'materials' | 'dimensions' | 'care' | 'shipping'>('materials');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Sync image when variation changes
  useEffect(() => {
    if (selectedVariation?.imageUrl) {
      setSelectedImage(selectedVariation.imageUrl);
    }
  }, [selectedVariation]);

  const currentPrice = selectedVariation?.price || product.basePrice;
  const isOutOfStock = (selectedVariation?.stock ?? 0) <= 0;
  const maxStock = selectedVariation?.stock ?? 10;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('Selected variation is currently out of stock.', 'error');
      return;
    }
    addToCart(product, selectedVariation, quantity);
    showToast(`Added ${quantity}x ${product.name} (${selectedVariation.colorName}) to your bag.`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      showToast('Selected variation is currently out of stock.', 'error');
      return;
    }
    addToCart(product, selectedVariation, quantity);
    if (onCheckoutInstant) {
      onCheckoutInstant();
    } else {
      onNavigate('checkout');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#081d1a] py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#78716c] mb-8">
          <button onClick={() => onNavigate('home')} className="hover:text-[#081d1a]">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => onNavigate('shop')} className="hover:text-[#081d1a]">
            Shop
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            onClick={() => onNavigate('shop', { category: product.category })}
            className="hover:text-[#081d1a]"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#081d1a] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Contiguous Purchase Module Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Gallery with Zoom */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image Showcase */}
            <div className="relative aspect-square bg-[#f8f5ee] border border-[#ede5d8] overflow-hidden group">
              <img
                src={selectedImage}
                alt={`${product.name} in ${selectedVariation.colorName}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-[#081d1a] rounded shadow-md transition-colors"
                title="Enlarge Image"
                aria-label="Enlarge Image"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Variation pill tag */}
              <div className="absolute bottom-4 left-4 bg-[#081d1a]/85 backdrop-blur-xs text-[#c5a880] text-[10px] uppercase tracking-widest px-3 py-1 font-medium">
                Finish: {selectedVariation.colorName}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 aspect-square border overflow-hidden rounded-xs shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-[#081d1a] ring-2 ring-[#081d1a]/20 scale-102'
                        : 'border-[#ede5d8] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-[#ede5d8] space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8c7355]">
                  {product.collection}
                </span>
                <button
                  onClick={handleShare}
                  className="text-slate-400 hover:text-[#081d1a] p-1 transition-colors"
                  title="Share piece"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#081d1a] tracking-wide leading-tight">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex text-[#c5a880]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#c5a880]" />
                  ))}
                </div>
                <span className="font-medium text-[#081d1a]">{product.rating}</span>
                <span className="text-[#78716c]">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            {/* Price display with SKU */}
            <div className="py-3 border-y border-[#ede5d8] flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-serif font-medium text-[#081d1a] font-mono tabular-nums">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#78716c] ml-2 font-sans">MRP (Incl. of all taxes)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                SKU: {selectedVariation.sku}
              </span>
            </div>

            {/* Product Narrative */}
            <p className="text-xs sm:text-sm text-[#57534e] font-light leading-relaxed">
              {product.description}
            </p>

            {/* COLOR / FINISH VARIATION SELECTOR */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#081d1a] font-medium">
                  Precious Metal Finish: <strong className="text-[#8c7355]">{selectedVariation.colorName}</strong>
                </span>
                {/* Stock status indicator */}
                {isOutOfStock ? (
                  <span className="text-xs font-medium text-red-600">Out of Stock</span>
                ) : selectedVariation.stock <= 5 ? (
                  <span className="text-xs font-medium text-amber-700">
                    Only {selectedVariation.stock} remaining in stock
                  </span>
                ) : (
                  <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    In Stock ({selectedVariation.stock} ready to ship)
                  </span>
                )}
              </div>

              {/* Color Swatch Buttons */}
              <div className="flex items-center gap-3">
                {product.variations.map((v) => {
                  const isSelected = selectedVariation.id === v.id;
                  const isSoldOut = v.stock <= 0;

                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariation(v);
                        setQuantity(1);
                      }}
                      className={`group relative flex items-center gap-2 px-3 py-2 border text-xs transition-all ${
                        isSelected
                          ? 'border-[#081d1a] bg-[#081d1a] text-[#c5a880]'
                          : 'border-[#ede5d8] bg-[#fcfaf7] text-[#44403c] hover:border-[#081d1a]'
                      } ${isSoldOut ? 'opacity-50' : ''}`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-xs"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span className="capitalize text-[11px] font-medium">{v.colorName}</span>
                      {isSoldOut && (
                        <span className="text-[9px] text-red-500 uppercase ml-1">(Sold out)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY SELECTOR & CTAS */}
            <div className="space-y-3 pt-4 border-t border-[#ede5d8]">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#081d1a] h-12 bg-[#fcfaf7]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 h-full hover:bg-[#e7dfcf] text-[#081d1a] transition-colors disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-mono font-medium text-[#081d1a] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                    disabled={quantity >= maxStock || isOutOfStock}
                    className="px-3 h-full hover:bg-[#e7dfcf] text-[#081d1a] transition-colors disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 h-12 text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#081d1a] text-[#c5a880] hover:bg-[#123833]'
                  }`}
                >
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                </button>
              </div>

              {/* Instant Buy Now Button */}
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 border border-[#8c7355] text-[#8c7355] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#8c7355] hover:text-white transition-colors"
                >
                  Buy Now with Express Checkout
                </button>
              )}
            </div>

            {/* Assurance trust chips */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#ede5d8] text-[11px] text-[#57534e]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8c7355]" />
                <span>Complimentary Insured Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8c7355]" />
                <span>Certified 18k Purity Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#8c7355]" />
                <span>14-Day Boutique Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8c7355]" />
                <span>Signature Velvet Box Included</span>
              </div>
            </div>

            {/* Accordion Tabs for Details */}
            <div className="pt-4 border-t border-[#ede5d8] space-y-2">
              <div className="flex border-b border-[#ede5d8] text-xs">
                {(['materials', 'dimensions', 'care', 'shipping'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-3 text-[11px] uppercase tracking-wider font-medium capitalize transition-colors relative ${
                      activeTab === tab
                        ? 'text-[#081d1a] font-semibold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#081d1a]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="py-3 text-xs text-[#57534e] leading-relaxed">
                {activeTab === 'materials' && (
                  <p>{product.materials}</p>
                )}
                {activeTab === 'dimensions' && (
                  <p>{product.dimensions || 'Adjustable fit suitable for standard wrist and neck proportions.'}</p>
                )}
                {activeTab === 'care' && (
                  <p>{product.careInstructions || 'Store in your LUNA suede pouch. Polish with a microfibre cloth.'}</p>
                )}
                {activeTab === 'shipping' && (
                  <p>
                    All orders are dispatched via tracked Blue Dart express shipping within 24 hours. Cash on delivery available across all Indian metro pincodes.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged Zoom Lightbox Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#c5a880] p-2 text-sm uppercase tracking-widest"
          >
            ✕ Close
          </button>
          <img
            src={selectedImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
