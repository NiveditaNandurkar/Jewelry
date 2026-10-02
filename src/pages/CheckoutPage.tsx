import React, { useState } from 'react';
import type { Order, PaymentMethod, ShippingAddress } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Lock, ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onNavigate: (tab: string) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onNavigate }) => {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('');
  const [country] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pricing calculations
  const FREE_SHIPPING_THRESHOLD = 1999;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 149;
  const taxRate = 0.03; // 3% GST on fine jewelry in India
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const finalTotal = subtotal + shippingFee + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#fcfaf7]">
        <h2 className="font-serif text-2xl text-[#081d1a] mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-[#78716c] mb-6">Select a fine piece of jewelry before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-widest font-medium"
        >
          Return to Boutique
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !phone || !addressLine1 || !city || !postalCode) {
      setErrorMsg('Please fill in all required shipping address fields.');
      return;
    }

    if (postalCode.length !== 6 || !/^\d+$/.test(postalCode)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN Code.');
      return;
    }

    setSubmitting(true);

    const shippingAddress: ShippingAddress = {
      fullName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    };

    const payload = {
      userId: user?.id || null,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        variationId: item.variationId,
        colorName: item.colorName,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        subtotal: item.price * item.quantity,
      })),
      paymentMethod,
      notes: orderNotes,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to place order. Please review your cart.');
        setSubmitting(false);
        showToast(data.error || 'Checkout failed', 'error');
        return;
      }

      clearCart();
      showToast(`Order #${data.orderNumber} successfully confirmed!`, 'success');
      onOrderSuccess(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network communication error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#081d1a] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8c7355]">
            Secure Checkout
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#081d1a] font-normal tracking-wide">
            Delivery & Payment
          </h1>
        </div>

        {errorMsg && (
          <div className="max-w-4xl mx-auto mb-6 p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded">
            <strong>Order Notice:</strong> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Info */}
            <div className="bg-white p-6 border border-[#ede5d8] space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-[#081d1a] pb-2 border-b border-[#ede5d8]">
                1. Customer Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aditi Sharma"
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2.5 focus:outline-none focus:border-[#081d1a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2.5 focus:outline-none focus:border-[#081d1a]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Email Address (For Order Tracking & Invoice) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2.5 focus:outline-none focus:border-[#081d1a]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 border border-[#ede5d8] space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-[#081d1a] pb-2 border-b border-[#ede5d8]">
                2. Shipping Destination
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Street Address / Apartment / Suite *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Flat 402, Sea Green Apts, Worli Sea Face"
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2.5 focus:outline-none focus:border-[#081d1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Landmark / Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Opposite Flora Fountain"
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2.5 focus:outline-none focus:border-[#081d1a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2.5 focus:outline-none focus:border-[#081d1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2.5 focus:outline-none focus:border-[#081d1a]"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="400018"
                      className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2.5 font-mono focus:outline-none focus:border-[#081d1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Gift Note or Delivery Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add personalized gift message card or ring sizing instructions..."
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 text-xs focus:outline-none focus:border-[#081d1a]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 border border-[#ede5d8] space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-[#081d1a] pb-2 border-b border-[#ede5d8]">
                3. Payment Method
              </h2>
              <div className="space-y-3">
                {/* Cash On Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#081d1a] bg-[#faf7f2]'
                      : 'border-[#ede5d8] hover:border-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 accent-[#081d1a]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#8c7355]" />
                      <span className="text-xs font-semibold text-[#081d1a]">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#78716c] mt-0.5">
                      Pay cash or UPI upon delivery. Verified door-to-door tamper-proof packaging.
                    </p>
                  </div>
                </label>

                {/* Razorpay / UPI / NetBanking Gateway */}
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#081d1a] bg-[#faf7f2]'
                      : 'border-[#ede5d8] hover:border-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-0.5 accent-[#081d1a]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#8c7355]" />
                      <span className="text-xs font-semibold text-[#081d1a]">
                        Instant Online Payment (UPI, Credit/Debit Cards, NetBanking)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#78716c] mt-0.5">
                      Instant verification via 256-bit encrypted Razorpay payment gateway.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Sticky Card */}
          <div className="lg:col-span-5 bg-white p-6 border border-[#ede5d8] space-y-6">
            <h2 className="font-serif text-lg text-[#081d1a] pb-3 border-b border-[#ede5d8]">
              Order Summary ({cart.length} items)
            </h2>

            {/* Itemized List */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover bg-[#f8f5ee] rounded-xs border border-[#ede5d8]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#081d1a] truncate">{item.productName}</p>
                    <p className="text-[10px] text-[#78716c]">
                      {item.colorName} · Qty: {item.quantity}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">{item.sku}</p>
                  </div>
                  <span className="font-mono font-medium text-[#081d1a] tabular-nums">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-4 border-t border-[#ede5d8] text-xs">
              <div className="flex justify-between text-[#78716c]">
                <span>Bag Subtotal</span>
                <span className="font-mono tabular-nums text-[#081d1a]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#78716c]">
                <span>Express Insured Shipping</span>
                <span className="text-[#081d1a]">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-medium">Free</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[#78716c]">
                <span>GST (3% Indian Precious Metal Tax)</span>
                <span className="font-mono tabular-nums text-[#081d1a]">
                  ₹{tax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#081d1a] pt-3 border-t border-[#ede5d8]">
                <span>Total Amount</span>
                <span className="font-mono text-lg tabular-nums text-[#081d1a]">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#123833] transition-colors shadow-lg flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {submitting
                  ? 'Confirming Order & Validating Stock...'
                  : `Confirm Order (₹${finalTotal.toLocaleString('en-IN')})`}
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-[#78716c] pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>LUNA Boutique Authentic Guarantee · 14-Day Exchange</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
