import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { BrandLogo } from './BrandLogo.tsx';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (authModalMode === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to login');
      } else {
        showToast('Successfully signed in.', 'success');
      }
    } else {
      if (!name) {
        setErrorMsg('Please enter your full name');
        setLoading(false);
        return;
      }
      const res = await register(email, password, name, phone);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to register');
      } else {
        showToast('Account created successfully.', 'success');
      }
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@lunaboutique.com');
    setPassword('admin123');
    setAuthModalMode('login');
  };

  const fillCustomerCredentials = () => {
    setEmail('customer@example.com');
    setPassword('password123');
    setAuthModalMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-[#0a2320] border border-[#164740] rounded shadow-2xl p-6 sm:p-8 z-10 text-[#fbf9f5]">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo light={true} />
          <p className="text-xs text-[#9ca3af] mt-2">
            {authModalMode === 'login'
              ? 'Access your private client portal & order archive'
              : 'Create an account for personalized jewelry services'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#143d37] mb-6">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 pb-3 text-xs tracking-widest uppercase font-medium transition-colors relative ${
              authModalMode === 'login' ? 'text-[#c5a880]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
            {authModalMode === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 pb-3 text-xs tracking-widest uppercase font-medium transition-colors relative ${
              authModalMode === 'register' ? 'text-[#c5a880]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
            {authModalMode === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-900/40 border border-red-500/50 rounded text-xs text-red-200 text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#071916] border border-[#164740] rounded px-3 py-2.5 pl-9 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 uppercase tracking-wider mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 98200 45890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#071916] border border-[#164740] rounded px-3 py-2.5 pl-9 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#071916] border border-[#164740] rounded px-3 py-2.5 pl-9 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#071916] border border-[#164740] rounded px-3 py-2.5 pl-9 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#c5a880] text-[#081d1a] font-medium tracking-widest uppercase text-xs rounded hover:bg-[#d6bc96] transition-colors mt-2"
          >
            {loading
              ? 'Processing...'
              : authModalMode === 'login'
              ? 'Sign In to Account'
              : 'Create Account'}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="mt-6 pt-5 border-t border-[#143d37] space-y-2">
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-wider">
            Quick Evaluation Credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={fillAdminCredentials}
              className="py-1.5 px-2 bg-[#123833] hover:bg-[#1a4f47] text-[#c5a880] border border-[#1e584f] rounded text-center transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              Admin Demo
            </button>
            <button
              onClick={fillCustomerCredentials}
              className="py-1.5 px-2 bg-[#123833] hover:bg-[#1a4f47] text-slate-200 border border-[#1e584f] rounded text-center transition-colors flex items-center justify-center gap-1"
            >
              <UserIcon className="w-3 h-3" />
              Customer Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
