import React from 'react';
import type { Order } from '../types/index.ts';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, Truck } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo.tsx';

interface OrderConfirmationPageProps {
  order: Order;
  onNavigate: (tab: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#081d1a] py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Receipt Card */}
        <div className="bg-white border border-[#ede5d8] shadow-xl p-8 sm:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 pb-8 border-b border-[#ede5d8]">
            <BrandLogo light={false} />
            <div className="flex items-center justify-center gap-2 text-emerald-700 pt-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">Order Confirmed</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#081d1a]">
              Thank You for Your Patronage
            </h1>
            <p className="text-xs text-[#78716c] max-w-md mx-auto">
              Your piece has been placed in reservation. An order confirmation with parcel tracking details will be sent to{' '}
              <strong className="text-[#081d1a]">{order.customerEmail}</strong>.
            </p>
          </div>

          {/* Key Reference Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#fcfaf7] border border-[#ede5d8] text-xs">
            <div>
              <span className="text-[10px] uppercase text-[#78716c] block">Order Number</span>
              <strong className="font-mono text-[#081d1a] text-xs">{order.orderNumber}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#78716c] block">Order Date</span>
              <span className="text-[#081d1a]">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#78716c] block">Payment</span>
              <span className="text-[#081d1a] capitalize">{order.paymentMethod.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#78716c] block">Order Status</span>
              <span className="text-emerald-700 font-semibold">{order.orderStatus}</span>
            </div>
          </div>

          {/* Delivery Timeline Indicator */}
          <div className="p-4 border border-[#ede5d8] rounded-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#081d1a] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#8c7355]" />
                Insured Express Shipment
              </span>
              <span className="text-[#8c7355] font-medium text-[11px]">
                Estimated Delivery: 3–5 Business Days
              </span>
            </div>
            <p className="text-[11px] text-[#78716c]">
              Delivering to: {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
          </div>

          {/* Itemized Purchased Jewelry */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#081d1a] pb-2 border-b border-[#ede5d8]">
              Purchased Jewelry ({order.items.length})
            </h3>
            <div className="divide-y divide-[#ede5d8]">
              {order.items.map((item, index) => (
                <div key={index} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover bg-[#f8f5ee] rounded-xs border border-[#ede5d8]"
                    />
                    <div>
                      <p className="font-medium text-[#081d1a]">{item.productName}</p>
                      <p className="text-[11px] text-[#78716c]">
                        Finish: {item.colorName} · Qty: {item.quantity}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-medium text-[#081d1a] tabular-nums">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary Totals */}
          <div className="pt-4 border-t border-[#ede5d8] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#78716c]">
              <span>Subtotal</span>
              <span className="font-mono text-[#081d1a]">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#78716c]">
              <span>Insured Express Shipping</span>
              <span className="text-[#081d1a]">
                {order.shippingFee === 0 ? 'Complimentary' : `₹${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-[#78716c]">
              <span>GST (3% Indian Precious Metal Tax)</span>
              <span className="font-mono text-[#081d1a]">₹{order.tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-[#081d1a] pt-3 border-t border-[#ede5d8]">
              <span>Final Total Paid</span>
              <span className="font-mono tabular-nums text-lg">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-2.5 border border-[#ede5d8] text-xs font-medium hover:bg-[#fcfaf7] flex items-center justify-center gap-1.5 text-[#57534e]"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-8 py-3 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-widest font-medium hover:bg-[#123833] transition-colors flex items-center justify-center gap-2 group"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
