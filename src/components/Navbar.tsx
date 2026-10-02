import React, { useState } from 'react';
import { Search, User as UserIcon, ShoppingBag, Menu, X, Shield, LogOut } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: any) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenSearch }) => {
  const { cartCount, openCart } = useCart();
  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#081d1a] border-b border-[#123833]/60 transition-colors">
      {/* Top micro announcement bar */}
      <div className="bg-[#051412] text-[#c5a880] text-[10px] md:text-[11px] tracking-widest uppercase py-1.5 px-4 text-center border-b border-[#0f2e29]">
        Complimentary insured delivery on all orders over ₹1,999 · Handcrafted in Mumbai
      </div>

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNav('home')}
          className="focus:outline-none flex items-center cursor-pointer group"
          aria-label="LUNA Boutique Home"
        >
          <BrandLogo light={true} />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-9 text-xs tracking-[0.2em] font-medium text-[#fbf9f5]/80 uppercase">
          <button
            onClick={() => handleNav('shop')}
            className={`transition-colors hover:text-[#c5a880] py-2 relative ${
              currentTab === 'shop' ? 'text-[#c5a880]' : ''
            }`}
          >
            SHOP
            {currentTab === 'shop' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a880]" />
            )}
          </button>
          <button
            onClick={() => handleNav('collections')}
            className={`transition-colors hover:text-[#c5a880] py-2 relative ${
              currentTab === 'collections' ? 'text-[#c5a880]' : ''
            }`}
          >
            COLLECTIONS
            {currentTab === 'collections' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a880]" />
            )}
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`transition-colors hover:text-[#c5a880] py-2 relative ${
              currentTab === 'about' ? 'text-[#c5a880]' : ''
            }`}
          >
            ABOUT
            {currentTab === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a880]" />
            )}
          </button>
          <button
            onClick={() => handleNav('contact')}
            className={`transition-colors hover:text-[#c5a880] py-2 relative ${
              currentTab === 'contact' ? 'text-[#c5a880]' : ''
            }`}
          >
            CONTACT
            {currentTab === 'contact' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a880]" />
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] tracking-wider font-semibold border transition-all ${
                currentTab === 'admin'
                  ? 'bg-[#c5a880] text-[#081d1a] border-[#c5a880]'
                  : 'bg-[#123833]/50 text-[#c5a880] border-[#c5a880]/40 hover:bg-[#c5a880]/20'
              }`}
            >
              <Shield className="w-3 h-3" />
              ADMIN PANEL
            </button>
          )}
        </nav>

        {/* Zone 3: Actions (Search, Account, Cart) */}
        <div className="flex items-center gap-4 text-[#fbf9f5]/90">
          <button
            onClick={onOpenSearch}
            className="p-2 hover:text-[#c5a880] transition-colors focus:outline-none"
            aria-label="Search jewelry"
          >
            <Search className="w-4 h-4 stroke-[1.75]" />
          </button>

          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal('login');
                } else {
                  setUserDropdownOpen(!userDropdownOpen);
                }
              }}
              className="p-2 hover:text-[#c5a880] transition-colors focus:outline-none flex items-center gap-1"
              aria-label="User Account"
            >
              <UserIcon className="w-4 h-4 stroke-[1.75]" />
              {user && (
                <span className="hidden lg:inline text-[11px] text-[#c5a880] max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {userDropdownOpen && user && (
              <div
                className="absolute right-0 mt-2 w-48 bg-[#0a2320] border border-[#164740] rounded shadow-2xl py-2 z-50 text-xs text-[#fbf9f5]"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-[#123833]">
                  <p className="font-medium text-[#c5a880] truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleNav('account-orders');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#123833] transition-colors"
                >
                  My Orders & Receipts
                </button>
                {isAdmin ? (
                  <button
                    onClick={() => {
                      handleNav('admin');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#123833] text-[#c5a880] transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleNav('admin');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#123833] text-slate-300 transition-colors"
                  >
                    Admin Login
                  </button>
                )}
                <div className="border-t border-[#123833] mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#123833] text-red-300 transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon with badge */}
          <button
            onClick={openCart}
            className="p-2 hover:text-[#c5a880] transition-colors relative focus:outline-none"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0.5 bg-[#c5a880] text-[#081d1a] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#fbf9f5]/80 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071916] border-b border-[#123833] px-6 py-6 space-y-4 text-xs tracking-widest uppercase text-[#fbf9f5]/90">
          <button
            onClick={() => handleNav('shop')}
            className="block w-full text-left py-2 hover:text-[#c5a880]"
          >
            SHOP CATALOG
          </button>
          <button
            onClick={() => handleNav('collections')}
            className="block w-full text-left py-2 hover:text-[#c5a880]"
          >
            COLLECTIONS
          </button>
          <button
            onClick={() => handleNav('about')}
            className="block w-full text-left py-2 hover:text-[#c5a880]"
          >
            OUR STORY
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="block w-full text-left py-2 hover:text-[#c5a880]"
          >
            CONCIERGE & CONTACT
          </button>

          <div className="pt-4 border-t border-[#123833] flex flex-col gap-3">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-red-400 text-[11px] underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="text-left text-[#c5a880] py-1"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={() => handleNav('admin')}
              className="text-left text-[#c5a880] py-1 flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
