export type ProductColor = 'Yellow Gold' | 'Rose Gold' | 'White Gold' | 'Sterling Silver' | 'Platinum';

export interface ProductVariation {
  id: string;
  productId: string;
  colorName: string;
  colorHex: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'Necklaces' | 'Earrings' | 'Bracelets' | 'Rings' | 'Pendants';
  collection: string;
  description: string;
  materials: string;
  dimensions?: string;
  careInstructions?: string;
  basePrice: number;
  salePrice?: number | null;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isActive: boolean;
  images: string[];
  variations: ProductVariation[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  bannerImage: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  variationId: string;
  colorName: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'cod' | 'razorpay' | 'stripe' | 'upi';

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug?: string;
  variationId: string;
  colorName: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl: string;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  trackingCarrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  variationId: string;
  sku: string;
  colorName: string;
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: string;
  orderId?: string;
  timestamp: string;
}

export interface StoreSettings {
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  taxRatePercent: number;
  codEnabled: boolean;
  razorpayKeyId?: string;
  stripePublishableKey?: string;
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}
