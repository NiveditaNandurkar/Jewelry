import React, { useState, useEffect } from 'react';
import type { Product, Order, InventoryLog, StoreSettings, OrderStatus, ProductVariation } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Settings,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  X,
  Truck,
  RotateCcw
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome, onRefreshData }) => {
  const { user, isAdmin, login } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'inventory' | 'settings'>('dashboard');

  // Admin login fallback state
  const [adminEmail, setAdminEmail] = useState('admin@lunaboutique.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockTarget, setStockTarget] = useState<{ product: Product; variation: ProductVariation } | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [stockReason, setStockReason] = useState<string>('Restock from Colaba studio');

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');

  // Fetch admin data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [anaRes, prodRes, ordRes, invRes, setRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/products'),
        fetch('/api/orders'),
        fetch('/api/admin/inventory/logs'),
        fetch('/api/settings'),
      ]);

      if (anaRes.ok) setAnalytics(await anaRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (invRes.ok) setInventoryLogs(await invRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const res = await login(adminEmail, adminPassword);
    setLoginLoading(false);
    if (!res.success) {
      setLoginError(res.error || 'Failed to authenticate admin');
    } else {
      showToast('Admin access authorized.', 'success');
    }
  };

  // --- PRODUCT MANAGEMENT HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Product successfully deleted', 'success');
        fetchData();
        onRefreshData?.();
      }
    } catch {
      showToast('Delete operation failed', 'error');
    }
  };

  // --- ORDER STATUS HANDLER ---
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, trackingCarrier?: string, trackingNumber?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, carrier: trackingCarrier, trackingNumber }),
      });
      if (res.ok) {
        showToast(`Order status updated to ${status}`, 'success');
        setOrderModalOpen(false);
        fetchData();
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  // --- STOCK ADJUSTMENT HANDLER ---
  const handleAdjustStock = async () => {
    if (!stockTarget) return;
    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: stockTarget.product.id,
          variationId: stockTarget.variation.id,
          newStock: newStockValue,
          reason: stockReason,
        }),
      });
      if (res.ok) {
        showToast('Stock quantity adjusted successfully', 'success');
        setStockModalOpen(false);
        fetchData();
        onRefreshData?.();
      }
    } catch {
      showToast('Failed to adjust inventory', 'error');
    }
  };

  // If not admin, show secure login gate
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#081d1a] text-[#fbf9f5]">
        <div className="w-full max-w-md bg-[#0a2320] border border-[#164740] p-8 rounded shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <ShieldAlert className="w-10 h-10 text-[#c5a880] mx-auto" />
            <h1 className="font-serif text-2xl text-[#fbf9f5]">LUNA Administrative Console</h1>
            <p className="text-xs text-slate-400">
              Restricted portal for catalog, order fulfillment, and inventory audit.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-900/50 border border-red-500/50 rounded text-xs text-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#071916] border border-[#164740] px-3 py-2.5 rounded text-white focus:outline-none focus:border-[#c5a880]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                Admin Passkey
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#071916] border border-[#164740] px-3 py-2.5 rounded text-white focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#c5a880] text-[#081d1a] font-semibold text-xs uppercase tracking-widest hover:bg-[#d6bc96] transition-colors rounded"
            >
              {loginLoading ? 'Authenticating...' : 'Enter Admin Console'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#123833] flex justify-between items-center text-xs">
            <button
              onClick={onNavigateHome}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Boutique
            </button>
            <span className="text-[10px] text-[#c5a880]">Role: Super Admin</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#081d1a]">
      {/* Top Admin Sub-bar */}
      <div className="bg-[#051412] text-[#fbf9f5] border-b border-[#0f2e29] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif tracking-widest text-sm text-[#c5a880]">LUNA BOUTIQUE</span>
          <span className="text-[10px] bg-[#123833] text-[#c5a880] px-2 py-0.5 rounded uppercase tracking-wider font-semibold border border-[#1a4a42]">
            Admin Control Center
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-slate-300 hover:text-[#c5a880] transition-colors"
          >
            <span>View Live Boutique</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">{user?.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#ede5d8] mb-8 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'dashboard', label: 'Overview & KPIs', icon: LayoutDashboard },
            { id: 'products', label: 'Product Catalog', icon: Package },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
            { id: 'inventory', label: 'Inventory & Stock Audit', icon: Boxes },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 font-medium transition-all whitespace-nowrap rounded-t-sm ${
                  isActive
                    ? 'bg-white border-t-2 border-t-[#081d1a] border-x border-[#ede5d8] text-[#081d1a] font-semibold shadow-xs'
                    : 'text-[#78716c] hover:text-[#081d1a]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#8c7355]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 border border-[#ede5d8] rounded-xs shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#78716c] block mb-1">
                  Gross Sales (INR)
                </span>
                <p className="font-mono text-2xl font-bold text-[#081d1a] tabular-nums">
                  ₹{analytics ? analytics.totalSales.toLocaleString('en-IN') : '0'}
                </p>
                <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3" />
                  Live verified database orders
                </span>
              </div>

              <div className="bg-white p-5 border border-[#ede5d8] rounded-xs shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#78716c] block mb-1">
                  Total Orders
                </span>
                <p className="font-mono text-2xl font-bold text-[#081d1a] tabular-nums">
                  {analytics?.totalOrders ?? orders.length}
                </p>
                <span className="text-[10px] text-[#78716c] mt-2 block">
                  All customer transactions
                </span>
              </div>

              <div className="bg-white p-5 border border-[#ede5d8] rounded-xs shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#78716c] block mb-1">
                  Active Products
                </span>
                <p className="font-mono text-2xl font-bold text-[#081d1a] tabular-nums">
                  {analytics?.totalProducts ?? products.length}
                </p>
                <span className="text-[10px] text-[#78716c] mt-2 block">
                  Fine jewelry in storefront
                </span>
              </div>

              <div className="bg-white p-5 border border-[#ede5d8] rounded-xs shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#78716c] block mb-1">
                  Low Stock Variations
                </span>
                <p className="font-mono text-2xl font-bold text-amber-700 tabular-nums">
                  {analytics?.lowStockCount ?? 0}
                </p>
                <span className="text-[10px] text-amber-800 flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-3 h-3" />
                  Stock ≤ 10 units
                </span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white p-6 border border-[#ede5d8] rounded-xs space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#ede5d8]">
                <h3 className="font-serif text-lg text-[#081d1a]">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#8c7355] hover:text-[#081d1a] flex items-center gap-1 font-medium"
                >
                  <span>View All Orders</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#fcfaf7] border-b border-[#ede5d8] text-[#78716c] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Order Number</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total Amount</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede5d8]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#fcfaf7]">
                        <td className="py-3 px-3 font-mono font-semibold text-[#081d1a]">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-[#081d1a]">{ord.customerName}</p>
                          <p className="text-[10px] text-slate-400">{ord.customerEmail}</p>
                        </td>
                        <td className="py-3 px-3 text-[#78716c]">
                          {ord.items.length} item(s) ({ord.items.map((i) => i.colorName).join(', ')})
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-[#081d1a] tabular-nums">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 uppercase text-[10px] text-[#78716c]">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setOrderModalOpen(true);
                            }}
                            className="text-[#8c7355] hover:text-[#081d1a] underline"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCT CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white border border-[#ede5d8] p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#ede5d8]">
              <div>
                <h3 className="font-serif text-xl text-[#081d1a]">Product Catalog</h3>
                <p className="text-xs text-[#78716c]">
                  Manage pieces, SKU identifiers, color variations, and pricing.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-1.5 pl-8 text-xs focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-wider font-semibold hover:bg-[#123833] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#fcfaf7] border-b border-[#ede5d8] text-[#78716c] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Variations & Finishes</th>
                    <th className="py-2.5 px-3">Base Price</th>
                    <th className="py-2.5 px-3">Total Stock</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ede5d8]">
                  {products
                    .filter((p) =>
                      productSearch
                        ? p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(productSearch.toLowerCase())
                        : true
                    )
                    .map((prod) => {
                      const totalStock = prod.variations.reduce((sum, v) => sum + v.stock, 0);
                      return (
                        <tr key={prod.id} className="hover:bg-[#fcfaf7]">
                          <td className="py-3 px-3 flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover bg-[#f8f5ee] rounded-xs border border-[#ede5d8]"
                            />
                            <div>
                              <p className="font-serif font-medium text-[#081d1a]">{prod.name}</p>
                              <p className="text-[10px] text-slate-400">{prod.collection}</p>
                            </div>
                          </td>
                          <td className="py-3 px-3 capitalize text-[#78716c]">{prod.category}</td>
                          <td className="py-3 px-3">
                            <div className="flex flex-wrap gap-1.5">
                              {prod.variations.map((v) => (
                                <span
                                  key={v.id}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#fcfaf7] border border-[#ede5d8] text-[10px] rounded-xs"
                                  title={`SKU: ${v.sku} | Stock: ${v.stock}`}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: v.colorHex }}
                                  />
                                  <span>{v.colorName}</span>
                                  <span className="font-mono text-slate-400">({v.stock})</span>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-medium text-[#081d1a] tabular-nums">
                            ₹{prod.basePrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 font-mono tabular-nums">
                            <span
                              className={`font-semibold ${
                                totalStock <= 10 ? 'text-amber-700' : 'text-[#081d1a]'
                              }`}
                            >
                              {totalStock} units
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[10px] uppercase font-semibold px-2 py-0.5 ${
                                prod.isActive
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {prod.isActive ? 'Active' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1 text-slate-500 hover:text-[#081d1a]"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1 text-slate-400 hover:text-red-600"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ORDER FULFILLMENT MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#ede5d8] p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#ede5d8]">
              <div>
                <h3 className="font-serif text-xl text-[#081d1a]">Customer Orders</h3>
                <p className="text-xs text-[#78716c]">
                  Manage dispatch, update tracking, and process order cancellations.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-[#081d1a] text-[#c5a880] font-semibold'
                        : 'bg-[#fcfaf7] border border-[#ede5d8] text-[#78716c] hover:text-[#081d1a]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#fcfaf7] border-b border-[#ede5d8] text-[#78716c] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Order Number</th>
                    <th className="py-2.5 px-3">Customer & Address</th>
                    <th className="py-2.5 px-3">Items & Finishes</th>
                    <th className="py-2.5 px-3">Total Amount</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Tracking</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ede5d8]">
                  {orders
                    .filter((ord) => (orderStatusFilter === 'all' ? true : ord.orderStatus === orderStatusFilter))
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#fcfaf7]">
                        <td className="py-3 px-3 font-mono font-semibold text-[#081d1a]">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-[#081d1a]">{ord.customerName}</p>
                          <p className="text-[10px] text-slate-400">
                            {ord.shippingAddress.city}, {ord.shippingAddress.state} ({ord.shippingAddress.postalCode})
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            {ord.items.map((it, idx) => (
                              <p key={idx} className="text-[11px] text-[#44403c]">
                                {it.quantity}x {it.productName} ({it.colorName})
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-[#081d1a] tabular-nums">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 uppercase text-[10px] text-[#78716c]">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </td>
                        <td className="py-3 px-3 text-[11px]">
                          {ord.trackingNumber ? (
                            <span className="font-mono text-emerald-800 font-medium">
                              {ord.trackingCarrier}: {ord.trackingNumber}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not Dispatched</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setOrderModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-[#081d1a] text-[#c5a880] text-[10px] uppercase tracking-wider hover:bg-[#123833]"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. INVENTORY & STOCK AUDIT LOGS */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            {/* Variation Stock Table */}
            <div className="bg-white border border-[#ede5d8] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#ede5d8]">
                <h3 className="font-serif text-xl text-[#081d1a]">Current Variation Inventory</h3>
                <p className="text-xs text-[#78716c]">
                  Click "Adjust" on any variation to update stock and record audit ledger entries.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#fcfaf7] border-b border-[#ede5d8] text-[#78716c] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2 px-3">Product Name</th>
                      <th className="py-2 px-3">Color / Finish</th>
                      <th className="py-2 px-3">SKU</th>
                      <th className="py-2 px-3">Unit Price</th>
                      <th className="py-2 px-3">Stock Units</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-right">Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede5d8]">
                    {products.flatMap((prod) =>
                      prod.variations.map((v) => (
                        <tr key={v.id} className="hover:bg-[#fcfaf7]">
                          <td className="py-2.5 px-3 font-medium text-[#081d1a]">{prod.name}</td>
                          <td className="py-2.5 px-3 flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20"
                              style={{ backgroundColor: v.colorHex }}
                            />
                            <span>{v.colorName}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{v.sku}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums">
                            ₹{v.price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold tabular-nums">
                            {v.stock}
                          </td>
                          <td className="py-2.5 px-3">
                            {v.stock <= 0 ? (
                              <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 uppercase font-medium">
                                Out of Stock
                              </span>
                            ) : v.stock <= 10 ? (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 uppercase font-medium">
                                Low Stock
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 uppercase font-medium">
                                Healthy
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setStockTarget({ product: prod, variation: v });
                                setNewStockValue(v.stock);
                                setStockModalOpen(true);
                              }}
                              className="text-xs text-[#8c7355] hover:text-[#081d1a] underline"
                            >
                              Adjust
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inventory Change Audit Trail */}
            <div className="bg-white border border-[#ede5d8] p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg text-[#081d1a] pb-2 border-b border-[#ede5d8]">
                Inventory Audit Trail
              </h3>
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#fcfaf7] border-b border-[#ede5d8] text-[#78716c] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2 px-3">Timestamp</th>
                      <th className="py-2 px-3">Product / SKU</th>
                      <th className="py-2 px-3">Change</th>
                      <th className="py-2 px-3">Previous → New</th>
                      <th className="py-2 px-3">Reason / Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede5d8]">
                    {inventoryLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#fcfaf7]">
                        <td className="py-2 px-3 text-slate-400">
                          {new Date(log.timestamp).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2 px-3">
                          <strong className="text-[#081d1a]">{log.productName}</strong> ({log.colorName})
                          <span className="font-mono text-[10px] text-slate-400 block">{log.sku}</span>
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold">
                          <span className={log.changeAmount < 0 ? 'text-red-700' : 'text-emerald-700'}>
                            {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-600">
                          {log.previousStock} → {log.newStock}
                        </td>
                        <td className="py-2 px-3 text-[#57534e]">{log.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. STORE SETTINGS */}
        {activeTab === 'settings' && settings && (
          <div className="bg-white border border-[#ede5d8] p-8 max-w-2xl space-y-6 shadow-xs">
            <h3 className="font-serif text-xl text-[#081d1a] pb-3 border-b border-[#ede5d8]">
              Store & Commercial Settings
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Store Currency
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${settings.currency} (${settings.currencySymbol})`}
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Precious Metal Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={settings.taxRatePercent}
                    onChange={(e) => setSettings({ ...settings, taxRatePercent: Number(e.target.value) })}
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Free Express Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Standard Shipping Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.standardShippingFee}
                    onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                  Cash on Delivery (COD) Availability
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.codEnabled}
                    onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#081d1a]"
                  />
                  <span>Allow customers to pay via Cash or UPI at door</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                  Boutique Concierge Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                  Boutique Physical Address
                </label>
                <textarea
                  rows={2}
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 text-xs"
                />
              </div>

              <button
                onClick={async () => {
                  try {
                    await fetch('/api/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(settings),
                    });
                    showToast('Store settings updated', 'success');
                  } catch {
                    showToast('Failed to save settings', 'error');
                  }
                }}
                className="px-6 py-2.5 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-wider font-semibold hover:bg-[#123833]"
              >
                Save Store Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL 1: ADD/EDIT PRODUCT MODAL --- */}
      {productModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setProductModalOpen(false)}
          onSuccess={() => {
            setProductModalOpen(false);
            fetchData();
            onRefreshData?.();
          }}
        />
      )}

      {/* --- MODAL 2: ORDER MANAGEMENT MODAL --- */}
      {orderModalOpen && selectedOrder && (
        <OrderManagementModal
          order={selectedOrder}
          onClose={() => setOrderModalOpen(false)}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}

      {/* --- MODAL 3: INVENTORY ADJUSTMENT MODAL --- */}
      {stockModalOpen && stockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 border border-[#ede5d8] rounded shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif text-lg text-[#081d1a]">
              Adjust Stock — {stockTarget.product.name}
            </h3>
            <p className="text-[#78716c]">
              Variation: <strong className="text-[#081d1a]">{stockTarget.variation.colorName}</strong> ({stockTarget.variation.sku})
            </p>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                New Stock Count
              </label>
              <input
                type="number"
                min={0}
                value={newStockValue}
                onChange={(e) => setNewStockValue(Number(e.target.value))}
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                Audit Reason
              </label>
              <input
                type="text"
                value={stockReason}
                onChange={(e) => setStockReason(e.target.value)}
                placeholder="e.g. Restock batch from goldsmith"
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStockModalOpen(false)}
                className="px-4 py-2 border border-[#ede5d8] text-xs hover:bg-[#fcfaf7]"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustStock}
                className="px-5 py-2 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-wider font-semibold hover:bg-[#123833]"
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUBCOMPONENT: PRODUCT FORM MODAL ---
interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState<any>(product?.category || 'Necklaces');
  const [collection, setCollection] = useState(product?.collection || 'The Luna Collection');
  const [description, setDescription] = useState(product?.description || '');
  const [materials, setMaterials] = useState(product?.materials || '18k Solid Gold / Lab Moissanite');
  const [basePrice, setBasePrice] = useState(product?.basePrice || 2999);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isActive, setIsActive] = useState(product?.isActive !== undefined ? product.isActive : true);

  // Variations state
  const [variations, setVariations] = useState<ProductVariation[]>(
    product?.variations || [
      {
        id: 'var-new-1',
        productId: '',
        colorName: 'Yellow Gold',
        colorHex: '#d4af37',
        sku: 'LUNA-YG-01',
        price: 2999,
        stock: 15,
        imageUrl: '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
        isDefault: true,
        isActive: true,
      },
      {
        id: 'var-new-2',
        productId: '',
        colorName: 'Rose Gold',
        colorHex: '#b76e79',
        sku: 'LUNA-RG-01',
        price: 2999,
        stock: 10,
        imageUrl: '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
        isDefault: false,
        isActive: true,
      },
      {
        id: 'var-new-3',
        productId: '',
        colorName: 'White Gold',
        colorHex: '#e5e7eb',
        sku: 'LUNA-WG-01',
        price: 2899,
        stock: 8,
        imageUrl: '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
        isDefault: false,
        isActive: true,
      }
    ]
  );

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please provide a product title', 'error');
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      category,
      collection,
      description,
      materials,
      basePrice: Number(basePrice),
      isFeatured,
      isActive,
      images: [variations[0]?.imageUrl || '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg'],
      variations,
    };

    try {
      const url = isEditing ? `/api/admin/products/${product!.id}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showToast('Error saving product', 'error');
        setSubmitting(false);
        return;
      }

      showToast(isEditing ? 'Product updated' : 'New product published', 'success');
      onSuccess();
    } catch {
      showToast('Request failed', 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white max-w-2xl w-full p-6 sm:p-8 border border-[#ede5d8] rounded shadow-2xl my-8 space-y-6 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#ede5d8]">
          <h3 className="font-serif text-xl text-[#081d1a]">
            {isEditing ? `Edit ${product!.name}` : 'Add New Fine Jewelry Piece'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-[#081d1a]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Celestia Solitaire Ring"
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 text-xs focus:outline-none"
              >
                <option value="Necklaces">Necklaces</option>
                <option value="Earrings">Earrings</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Rings">Rings</option>
                <option value="Pendants">Pendants</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                Collection
              </label>
              <input
                type="text"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                placeholder="The Luna Collection"
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                Editorial Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the craftsmanship, silhouette, and stone setting..."
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                Materials & Gemological Specifications
              </label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="18k Solid Gold / Lab Moissanite / Hypoallergenic"
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                Base Price (₹)
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-[#081d1a]"
                />
                <span className="text-[#081d1a] font-medium">Feature on Homepage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#081d1a]"
                />
                <span className="text-[#081d1a] font-medium">Published / Active</span>
              </label>
            </div>
          </div>

          {/* Color Variations Section */}
          <div className="pt-4 border-t border-[#ede5d8] space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#081d1a]">
              Color Variations & Stock Units
            </h4>
            <div className="space-y-2">
              {variations.map((v, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center p-2.5 bg-[#fcfaf7] border border-[#ede5d8]">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={v.colorName}
                      onChange={(e) => {
                        const next = [...variations];
                        next[i].colorName = e.target.value;
                        setVariations(next);
                      }}
                      placeholder="Color Name"
                      className="w-full bg-white border border-[#ede5d8] px-2 py-1 text-[11px]"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => {
                        const next = [...variations];
                        next[i].sku = e.target.value;
                        setVariations(next);
                      }}
                      placeholder="SKU"
                      className="w-full bg-white border border-[#ede5d8] px-2 py-1 font-mono text-[11px]"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => {
                        const next = [...variations];
                        next[i].price = Number(e.target.value);
                        setVariations(next);
                      }}
                      placeholder="Price"
                      className="w-full bg-white border border-[#ede5d8] px-2 py-1 font-mono text-[11px]"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => {
                        const next = [...variations];
                        next[i].stock = Number(e.target.value);
                        setVariations(next);
                      }}
                      placeholder="Stock"
                      className="w-full bg-white border border-[#ede5d8] px-2 py-1 font-mono text-[11px]"
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <input
                      type="color"
                      value={v.colorHex}
                      onChange={(e) => {
                        const next = [...variations];
                        next[i].colorHex = e.target.value;
                        setVariations(next);
                      }}
                      className="w-6 h-6 rounded cursor-pointer border border-[#ede5d8] inline-block"
                      title="Finish Swatch Color"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#ede5d8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#ede5d8] text-xs hover:bg-[#fcfaf7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-wider font-semibold hover:bg-[#123833]"
            >
              {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- SUBCOMPONENT: ORDER MANAGEMENT MODAL ---
interface OrderManagementModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, carrier?: string, trackingNumber?: string) => void;
}

const OrderManagementModal: React.FC<OrderManagementModalProps> = ({ order, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState<OrderStatus>(order.orderStatus);
  const [carrier, setCarrier] = useState(order.trackingCarrier || 'Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white max-w-xl w-full p-6 sm:p-8 border border-[#ede5d8] rounded shadow-2xl my-8 space-y-6 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#ede5d8]">
          <div>
            <h3 className="font-serif text-xl text-[#081d1a]">Order #{order.orderNumber}</h3>
            <p className="text-[11px] text-[#78716c]">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-[#081d1a]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="p-3 bg-[#fcfaf7] border border-[#ede5d8] space-y-1">
          <p className="font-medium text-[#081d1a]">Customer: {order.customerName}</p>
          <p className="text-[#57534e]">Email: {order.customerEmail} | Phone: {order.customerPhone}</p>
          <p className="text-[#57534e]">
            Address: {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
          </p>
          {order.notes && (
            <p className="text-[#8c7355] italic pt-1">Note: {order.notes}</p>
          )}
        </div>

        {/* Purchased Items */}
        <div className="space-y-2">
          <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#081d1a]">
            Purchased Jewelry ({order.items.length})
          </h4>
          <div className="divide-y divide-[#ede5d8] border border-[#ede5d8]">
            {order.items.map((item, i) => (
              <div key={i} className="p-2.5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#081d1a]">{item.productName}</p>
                  <p className="text-[10px] text-[#78716c]">
                    Finish: {item.colorName} | Qty: {item.quantity} | SKU: {item.sku}
                  </p>
                </div>
                <span className="font-mono font-medium">₹{item.subtotal.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold text-sm pt-2 text-[#081d1a]">
            <span>Total Value:</span>
            <span className="font-mono">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Status & Tracking update */}
        <div className="pt-4 border-t border-[#ede5d8] space-y-3">
          <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#081d1a]">
            Fulfillment Status & Parcel Tracking
          </h4>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
              Order Lifecycle Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 text-xs focus:outline-none"
            >
              <option value="Pending">Pending Review</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing & Hallmarking</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled (Auto-Restore Inventory)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                Logistics Carrier
              </label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Blue Dart / Sequel Logistics"
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                Airway Bill / Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. BLUEDART-8829410"
                className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3 py-2 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-[#ede5d8]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#ede5d8] text-xs hover:bg-[#fcfaf7]"
          >
            Close
          </button>
          <button
            onClick={() => onUpdateStatus(order.id, status, carrier, trackingNumber)}
            className="px-5 py-2 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-wider font-semibold hover:bg-[#123833]"
          >
            Save Order Updates
          </button>
        </div>
      </div>
    </div>
  );
};
