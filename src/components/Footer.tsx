import React, { useState } from 'react';
import { ArrowRight, Instagram, Facebook, Check } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        showToast('Welcome to the LUNA Boutique inner circle.', 'success');
        setEmail('');
      } else {
        showToast('Subscription could not be processed.', 'error');
      }
    } catch {
      showToast('Welcome to LUNA Boutique!', 'success');
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#051412] text-[#fbf9f5] border-t border-[#0d2a25]">
      {/* Main Footer Row */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Column 1: Brand Wordmark */}
          <div className="md:col-span-4 flex flex-col items-start space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="focus:outline-none cursor-pointer"
            >
              <BrandLogo light={true} />
            </button>
            <p className="text-xs text-[#9ca3af] max-w-sm leading-relaxed mt-2">
              Sculpted fine jewelry inspired by understated silhouettes, luminous gemstones, and heirloom craftsmanship.
            </p>
            <div className="text-[11px] text-[#c5a880]/90 tracking-wider pt-2">
              Boutique Flagship: Colaba, Mumbai · Worldwide Delivery
            </div>
          </div>

          {/* Column 2: Navigation Links & Socials */}
          <div className="md:col-span-4 flex flex-col justify-between h-full space-y-6">
            <div className="flex flex-wrap items-center gap-6 text-[11px] tracking-[0.2em] font-medium text-[#fbf9f5]/80 uppercase">
              <button
                onClick={() => onNavigate('shop')}
                className="hover:text-[#c5a880] transition-colors"
              >
                SHOP
              </button>
              <button
                onClick={() => onNavigate('collections')}
                className="hover:text-[#c5a880] transition-colors"
              >
                COLLECTIONS
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="hover:text-[#c5a880] transition-colors"
              >
                ABOUT
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="hover:text-[#c5a880] transition-colors"
              >
                CONTACT
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-[#fbf9f5]/70 pt-2">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full border border-[#164740] flex items-center justify-center hover:text-[#c5a880] hover:border-[#c5a880] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full border border-[#164740] flex items-center justify-center hover:text-[#c5a880] hover:border-[#c5a880] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="#pinterest"
                className="w-8 h-8 rounded-full border border-[#164740] flex items-center justify-center hover:text-[#c5a880] hover:border-[#c5a880] transition-colors text-xs font-serif italic"
                aria-label="Pinterest"
              >
                P
              </a>
              <a
                href="#tiktok"
                className="w-8 h-8 rounded-full border border-[#164740] flex items-center justify-center hover:text-[#c5a880] hover:border-[#c5a880] transition-colors text-[10px] font-sans"
                aria-label="TikTok"
              >
                TT
              </a>
            </div>
          </div>

          {/* Column 3: Newsletter Sign-up */}
          <div className="md:col-span-4 flex flex-col space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#fbf9f5]">
              Join our newsletter
            </h4>
            <p className="text-xs text-[#9ca3af]">
              Be the first to preview new collections, private salon invitations, and styling notes.
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || subscribed}
                className="w-full bg-[#0a201c] border border-[#1a4a42] rounded px-4 py-3 text-xs text-[#fbf9f5] placeholder-[#6b7280] focus:outline-none focus:border-[#c5a880] transition-colors pr-11"
              />
              <button
                type="submit"
                disabled={loading || subscribed}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-[#c5a880] hover:text-white transition-colors focus:outline-none"
                aria-label="Subscribe"
              >
                {subscribed ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-emerald-400 mt-1">Thank you for joining our private list.</p>
            )}
          </div>
        </div>

        {/* Hairline Divider & Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#0e2a25] flex flex-col md:flex-row items-center justify-between text-xs text-[#6b7280] gap-4">
          <p>© 2026 LUNA BOUTIQUE. All rights reserved.</p>

          <p className="font-serif italic text-sm text-[#c5a880]/90">
            More than just jewelry <span className="text-[#c5a880] not-italic">♡</span>
          </p>

          <div className="flex items-center gap-5 text-[11px]">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Packaging</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
