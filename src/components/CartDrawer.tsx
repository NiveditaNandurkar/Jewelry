import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface CartDrawerProps {
  onCheckout: () => void;
  onNavigateShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onNavigateShop }) => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, cartCount } = useCart();

  const FREE_SHIPPING_THRESHOLD = 1999;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fcfaf7] border-l border-[#ede5d8] text-[#081d1a] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#ede5d8] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#8c7355]" />
              <h2 className="font-serif text-lg uppercase tracking-wider text-[#081d1a]">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-slate-400 hover:text-[#081d1a] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="px-5 py-3 bg-[#f5f0e6] border-b border-[#ede5d8] text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[#57534e]">
                  Add <strong className="text-[#081d1a] font-mono">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for <span className="font-semibold text-[#8c7355]">Complimentary Express Shipping</span>.
                </p>
                <div className="w-full bg-[#e7dfcf] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#081d1a] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#081d1a] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>You have unlocked complimentary insured express delivery!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f0eae0] flex items-center justify-center text-[#8c7355]">
                  <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg text-[#081d1a]">Your bag is empty</p>
                  <p className="text-xs text-[#78716c] max-w-xs">
                    Explore our curated collection of fine jewelry handcrafted for everyday elegance.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigateShop();
                  }}
                  className="px-6 py-2.5 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-widest font-medium hover:bg-[#123833] transition-colors"
                >
                  Discover Jewelry
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-[#f0eae0] rounded-xs shadow-xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover bg-[#f8f5ee] rounded-xs shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-medium text-[#081d1a] leading-tight">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#78716c]">
                        <span>Finish: <strong className="text-[#081d1a]">{item.colorName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[10px] text-slate-400">{item.sku}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f5f0e6]">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#d6cebf] rounded-xs overflow-hidden bg-[#faf7f2]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#e7dfcf] text-[#081d1a] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-medium text-[#081d1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className={`p-1 transition-colors ${
                            item.quantity >= item.stock
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'hover:bg-[#e7dfcf] text-[#081d1a]'
                          }`}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line subtotal */}
                      <span className="font-mono text-xs font-semibold text-[#081d1a] tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Totals & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#ede5d8] bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#78716c]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#081d1a]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#78716c]">
                  <span>Estimated Delivery</span>
                  <span className="text-[#081d1a]">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-emerald-700 font-medium uppercase text-[10px] tracking-wider">Free</span>
                    ) : (
                      '₹149'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-[#081d1a] pt-2 border-t border-[#f0eae0]">
                  <span>Estimated Total</span>
                  <span className="font-mono font-semibold tabular-nums text-base">
                    ₹{(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 149)).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Taxes calculated during final checkout.</p>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  onCheckout();
                }}
                className="w-full py-3.5 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#123833] transition-colors flex items-center justify-center gap-2 group shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  closeCart();
                  onNavigateShop();
                }}
                className="w-full text-center text-[11px] text-[#78716c] hover:text-[#081d1a] underline transition-colors"
              >
                Continue Browsing Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
