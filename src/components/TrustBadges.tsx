import React from 'react';
import { Truck, ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="bg-[#fcf9f5] border-y border-[#ede5d8] py-8 text-[#081d1a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#ede5d8]/70">
          <div className="flex flex-col items-center text-center pt-4 md:pt-0 px-2">
            <Truck className="w-5 h-5 mb-2.5 text-[#081d1a]/80 stroke-[1.5]" />
            <h4 className="text-[11px] font-semibold tracking-wider uppercase mb-0.5">Free Express Shipping</h4>
            <p className="text-xs text-[#6b7280]">On orders over ₹1,999</p>
          </div>

          <div className="flex flex-col items-center text-center pt-4 md:pt-0 px-2">
            <ShieldCheck className="w-5 h-5 mb-2.5 text-[#081d1a]/80 stroke-[1.5]" />
            <h4 className="text-[11px] font-semibold tracking-wider uppercase mb-0.5">Secure Payments</h4>
            <p className="text-xs text-[#6b7280]">Shop with confidence & COD</p>
          </div>

          <div className="flex flex-col items-center text-center pt-4 md:pt-0 px-2">
            <HeartHandshake className="w-5 h-5 mb-2.5 text-[#081d1a]/80 stroke-[1.5]" />
            <h4 className="text-[11px] font-semibold tracking-wider uppercase mb-0.5">Easy Returns</h4>
            <p className="text-xs text-[#6b7280]">Complimentary 14-day exchange</p>
          </div>

          <div className="flex flex-col items-center text-center pt-4 md:pt-0 px-2">
            <Leaf className="w-5 h-5 mb-2.5 text-[#081d1a]/80 stroke-[1.5]" />
            <h4 className="text-[11px] font-semibold tracking-wider uppercase mb-0.5">Sustainable Packaging</h4>
            <p className="text-xs text-[#6b7280]">FSC certified & recyclable</p>
          </div>
        </div>
      </div>
    </section>
  );
};
