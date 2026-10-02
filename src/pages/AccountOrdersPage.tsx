import React, { useState, useEffect } from 'react';
import type { Order } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Package, Search, ChevronRight, Truck, Clock } from 'lucide-react';

interface AccountOrdersPageProps {
  onNavigate: (tab: string) => void;
  onSelectOrder: (order: Order) => void;
}

export const AccountOrdersPage: React.FC<AccountOrdersPageProps> = ({ onNavigate, onSelectOrder }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lookupNumber, setLookupNumber] = useState('');
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = user ? `/api/orders?userId=${user.id}` : '/api/orders';
        const res = await fetch(url);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    if (!lookupNumber.trim()) return;

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(lookupNumber.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setLookupError('No order found with this reference number.');
      } else {
        onSelectOrder(data);
      }
    } catch {
      setLookupError('Could not locate order.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#081d1a] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="border-b border-[#ede5d8] pb-6">
          <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8c7355]">
            Client Portal
          </p>
          <h1 className="font-serif text-3xl font-normal text-[#081d1a] mt-1">
            Order Archive & Tracking
          </h1>
          {user && (
            <p className="text-xs text-[#78716c] mt-1">
              Logged in as <strong className="text-[#081d1a]">{user.name}</strong> ({user.email})
            </p>
          )}
        </div>

        {/* Guest Order Lookup Bar */}
        <div className="bg-white p-5 border border-[#ede5d8] space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#081d1a]">
            Track Parcel by Order Number
          </h3>
          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. LUNA-2026-4821"
              value={lookupNumber}
              onChange={(e) => setLookupNumber(e.target.value)}
              className="flex-1 bg-[#fcfaf7] border border-[#ede5d8] px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#081d1a]"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-wider font-medium hover:bg-[#123833] transition-colors"
            >
              Track Order
            </button>
          </form>
          {lookupError && (
            <p className="text-xs text-red-600">{lookupError}</p>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-[#081d1a]">
            Recent Orders ({orders.length})
          </h2>

          {loading ? (
            <p className="text-xs text-slate-400 py-6 text-center">Retrieving order history...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white p-10 border border-[#ede5d8] text-center space-y-3">
              <Package className="w-8 h-8 text-[#8c7355] mx-auto stroke-[1.2]" />
              <p className="font-serif text-lg text-[#081d1a]">No order records yet</p>
              <p className="text-xs text-[#78716c] max-w-sm mx-auto">
                Discover pieces from our signature jewelry collection to start your archive.
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-2.5 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-widest font-medium"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="bg-white border border-[#ede5d8] p-5 cursor-pointer hover:border-[#081d1a] transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-[#f5f0e6]">
                    <div>
                      <span className="font-mono font-semibold text-[#081d1a] text-sm">
                        {order.orderNumber}
                      </span>
                      <span className="text-[#78716c] ml-3">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-none ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Purchased items thumbnails */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover bg-[#f8f5ee] rounded-xs border border-[#ede5d8]"
                          />
                          <span className="text-xs text-[#081d1a] font-medium hidden sm:inline truncate max-w-[150px]">
                            {item.productName} ({item.colorName})
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-[#78716c] uppercase">Total</p>
                      <p className="font-mono text-sm font-semibold text-[#081d1a] tabular-nums">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
