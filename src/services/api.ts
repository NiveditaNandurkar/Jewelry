import type { Product, Order, StoreSettings, User, OrderStatus } from '../types/index.ts';
import { initialProducts, initialSettings } from '../data/seedData.ts';

// Local storage keys for GitHub Pages static fallback
const STORAGE_PRODUCTS_KEY = 'luna_static_products';
const STORAGE_ORDERS_KEY = 'luna_static_orders';
const STORAGE_SETTINGS_KEY = 'luna_static_settings';

function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return initialProducts;
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch {}
}

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch {}
}

export const apiService = {
  // Fetch products with automatic static fallback for GitHub Pages
  async getProducts(params?: { category?: string; search?: string }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);

      const res = await fetch(`/api/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback below
    }

    // Static fallback (GitHub Pages)
    let list = getLocalProducts();
    if (params?.category && params.category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  },

  // Create order with fallback
  async createOrder(orderPayload: any): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const order = await res.json();
        return { success: true, order };
      }
      if (res.status !== 404) {
        const errData = await res.json();
        return { success: false, error: errData.error || 'Failed to place order' };
      }
    } catch {
      // Fall through to static fallback
    }

    // Static fallback for GitHub Pages
    const orderNumber = `LUNA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = orderPayload.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 1999 ? 0 : 149;
    const tax = Math.round(subtotal * 0.03 * 100) / 100;
    const total = subtotal + shippingFee + tax;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: orderPayload.userId || null,
      customerName: orderPayload.customerName,
      customerEmail: orderPayload.customerEmail,
      customerPhone: orderPayload.customerPhone,
      shippingAddress: orderPayload.shippingAddress,
      items: orderPayload.items,
      subtotal,
      shippingFee,
      tax,
      discount: 0,
      total,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentMethod === 'cod' ? 'pending' : 'completed',
      orderStatus: 'Confirmed',
      notes: orderPayload.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const currentOrders = getLocalOrders();
    currentOrders.unshift(newOrder);
    saveLocalOrders(currentOrders);

    return { success: true, order: newOrder };
  },

  // Get orders
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const url = userId ? `/api/orders?userId=${userId}` : '/api/orders';
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const list = getLocalOrders();
    if (userId) {
      return list.filter((o) => o.userId === userId);
    }
    return list;
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus, trackingCarrier?: string, trackingNumber?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, carrier: trackingCarrier, trackingNumber }),
      });
      if (res.ok) return true;
    } catch {}

    const orders = getLocalOrders();
    const ord = orders.find((o) => o.id === orderId);
    if (ord) {
      ord.orderStatus = status;
      if (trackingCarrier) ord.trackingCarrier = trackingCarrier;
      if (trackingNumber) ord.trackingNumber = trackingNumber;
      saveLocalOrders(orders);
      return true;
    }
    return false;
  }
};
