import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  Product,
  ProductVariation,
  Category,
  Collection,
  User,
  Order,
  InventoryLog,
  StoreSettings,
  OrderItem,
  ShippingAddress,
  OrderStatus,
  PaymentStatus,
  PaymentMethod
} from '../types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  users: (User & { passwordHash: string })[];
  orders: Order[];
  inventoryLogs: InventoryLog[];
  settings: StoreSettings;
}

// Initial luxury seed data
const initialCategories: Category[] = [
  { id: 'cat-necklaces', name: 'Necklaces', slug: 'necklaces', description: 'Graceful pendants, chains, and chokers sculpted in pure gold.' },
  { id: 'cat-earrings', name: 'Earrings', slug: 'earrings', description: 'Delicate huggies, pavé studs, and dramatic evening drops.' },
  { id: 'cat-bracelets', name: 'Bracelets', slug: 'bracelets', description: 'Whisper-light chains, cuffs, and tennis bracelets.' },
  { id: 'cat-rings', name: 'Rings', slug: 'rings', description: 'Stackable bands, solitaire rings, and pavé eternity bands.' },
  { id: 'cat-pendants', name: 'Pendants', slug: 'pendants', description: 'Focal gemstones and celestial talisman emblems.' },
];

const initialCollections: Collection[] = [
  {
    id: 'col-luna',
    name: 'The Luna Collection',
    slug: 'the-luna-collection',
    tagline: 'Designed for moments that matter.',
    description: 'Our signature archival collection inspired by lunar phases, minimalist architecture, and timeless warmth.',
    bannerImage: '/src/assets/images/luna_hero_model_1790965022091.jpg',
  },
  {
    id: 'col-solstice',
    name: 'Solstice & Dawn',
    slug: 'solstice-and-dawn',
    tagline: 'Sunlit radiance in solid 18k gold.',
    description: 'High-polish gold textures sculpted to mirror twilight horizons and golden hour reflections.',
    bannerImage: '/src/assets/images/luna_packaging_story_1790965080289.jpg',
  }
];

const initialProducts: Product[] = [
  {
    id: 'prod-lumi-necklace',
    name: 'The Lumi Necklace',
    slug: 'the-lumi-necklace',
    category: 'Necklaces',
    collection: 'The Luna Collection',
    description: 'A signature talisman suspended on an 18-karat diamond-cut link chain. Featuring an ethically sourced teardrop solitaire crystal, hand-set into an ultra-low four-prong bezel to catch natural light from every vantage.',
    materials: '18k Solid Gold / Lab-Grown Moissanite Solitaire (1.20 ct equivalent) / Hypoallergenic & Nickel-Free',
    dimensions: 'Chain: 42cm with 5cm extension. Pendant: 9mm x 6mm',
    careInstructions: 'Store in your LUNA suede pouch. Polish gently with a microfibre cloth; avoid contact with perfume and chlorinated water.',
    basePrice: 3899,
    salePrice: null,
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    isActive: true,
    images: [
      '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
      '/src/assets/images/luna_hero_model_1790965022091.jpg'
    ],
    variations: [
      {
        id: 'var-lumi-yg',
        productId: 'prod-lumi-necklace',
        colorName: 'Yellow Gold',
        colorHex: '#d4af37',
        sku: 'LUNA-NK-LUMI-YG',
        price: 3899,
        stock: 22,
        imageUrl: '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
        isDefault: true,
        isActive: true,
      },
      {
        id: 'var-lumi-rg',
        productId: 'prod-lumi-necklace',
        colorName: 'Rose Gold',
        colorHex: '#b76e79',
        sku: 'LUNA-NK-LUMI-RG',
        price: 3899,
        stock: 14,
        imageUrl: '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
        isDefault: false,
        isActive: true,
      },
      {
        id: 'var-lumi-wg',
        productId: 'prod-lumi-necklace',
        colorName: 'White Gold',
        colorHex: '#e5e7eb',
        sku: 'LUNA-NK-LUMI-WG',
        price: 3699,
        stock: 9,
        imageUrl: '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
        isDefault: false,
        isActive: true,
      }
    ],
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod-seren-hoops',
    name: 'The Seren Hoops',
    slug: 'the-seren-hoops',
    category: 'Earrings',
    collection: 'The Luna Collection',
    description: 'Delicate huggie hoops adorned with twin rows of pavé-set round brilliant crystals. Engineered with an invisible click-latch for effortless daily comfort and zero-snag wear.',
    materials: '18k Vermeil over 925 Sterling Silver / VVS Clarity Lab Crystals',
    dimensions: 'Outer diameter: 14mm. Inner diameter: 10mm. Width: 3.5mm',
    careInstructions: 'Clean with lukewarm water and mild organic soap. Dry thoroughly before storing.',
    basePrice: 3199,
    salePrice: null,
    rating: 4.8,
    reviewsCount: 94,
    isFeatured: true,
    isActive: true,
    images: [
      '/src/assets/images/seren_hoops_earrings_1790965047028.jpg'
    ],
    variations: [
      {
        id: 'var-seren-yg',
        productId: 'prod-seren-hoops',
        colorName: 'Yellow Gold',
        colorHex: '#d4af37',
        sku: 'LUNA-ER-SEREN-YG',
        price: 3199,
        stock: 28,
        imageUrl: '/src/assets/images/seren_hoops_earrings_1790965047028.jpg',
        isDefault: true,
        isActive: true,
      },
      {
        id: 'var-seren-rg',
        productId: 'prod-seren-hoops',
        colorName: 'Rose Gold',
        colorHex: '#b76e79',
        sku: 'LUNA-ER-SEREN-RG',
        price: 3199,
        stock: 16,
        imageUrl: '/src/assets/images/seren_hoops_earrings_1790965047028.jpg',
        isDefault: false,
        isActive: true,
      },
      {
        id: 'var-seren-sl',
        productId: 'prod-seren-hoops',
        colorName: 'Sterling Silver',
        colorHex: '#e5e7eb',
        sku: 'LUNA-ER-SEREN-SL',
        price: 2999,
        stock: 12,
        imageUrl: '/src/assets/images/seren_hoops_earrings_1790965047028.jpg',
        isDefault: false,
        isActive: true,
      }
    ],
    createdAt: '2026-09-18T11:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod-vera-bracelet',
    name: 'The Vera Bracelet',
    slug: 'the-vera-bracelet',
    category: 'Bracelets',
    collection: 'The Luna Collection',
    description: 'A whisper-light chain celebrating subtle balance. Anchored by an asymmetrical bezel-set marquise gemstone and finished with an adjustable sliding silicone bead for a custom wrist contour.',
    materials: 'Solid 14k Gold / Marquise Cut Simulated Diamond (0.65 ct)',
    dimensions: 'Adjustable length: 15cm to 19cm. Marquise setting: 8mm x 4mm',
    careInstructions: 'Gently wipe with jewelers cloth. Store flat to avoid chain tangling.',
    basePrice: 2899,
    salePrice: null,
    rating: 4.9,
    reviewsCount: 81,
    isFeatured: true,
    isActive: true,
    images: [
      '/src/assets/images/vera_bracelet_chain_1790965058974.jpg'
    ],
    variations: [
      {
        id: 'var-vera-yg',
        productId: 'prod-vera-bracelet',
        colorName: 'Yellow Gold',
        colorHex: '#d4af37',
        sku: 'LUNA-BR-VERA-YG',
        price: 2899,
        stock: 18,
        imageUrl: '/src/assets/images/vera_bracelet_chain_1790965058974.jpg',
        isDefault: true,
        isActive: true,
      },
      {
        id: 'var-vera-rg',
        productId: 'prod-vera-bracelet',
        colorName: 'Rose Gold',
        colorHex: '#b76e79',
        sku: 'LUNA-BR-VERA-RG',
        price: 2899,
        stock: 11,
        imageUrl: '/src/assets/images/vera_bracelet_chain_1790965058974.jpg',
        isDefault: false,
        isActive: true,
      },
      {
        id: 'var-vera-pl',
        productId: 'prod-vera-bracelet',
        colorName: 'Platinum',
        colorHex: '#d1d5db',
        sku: 'LUNA-BR-VERA-PL',
        price: 2799,
        stock: 6,
        imageUrl: '/src/assets/images/vera_bracelet_chain_1790965058974.jpg',
        isDefault: false,
        isActive: true,
      }
    ],
    createdAt: '2026-09-20T14:30:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod-elys-ring',
    name: 'The Elys Ring',
    slug: 'the-elys-ring',
    category: 'Rings',
    collection: 'The Luna Collection',
    description: 'An eternity band micro-prong set with seven matched round brilliant crystals along a contoured arch. Hand-finished for stacking comfort alongside engagement solitaires or minimal bands.',
    materials: '18k Yellow Gold / D Color VVS1 Moissanites (Total 0.85ctw)',
    dimensions: 'Band thickness: 2.2mm. Stone row length: 16mm',
    careInstructions: 'Ultrasonic safe or soak in warm soapy water for 5 minutes.',
    basePrice: 3499,
    salePrice: null,
    rating: 5.0,
    reviewsCount: 112,
    isFeatured: true,
    isActive: true,
    images: [
      '/src/assets/images/elys_ring_band_1790965068653.jpg'
    ],
    variations: [
      {
        id: 'var-elys-yg',
        productId: 'prod-elys-ring',
        colorName: 'Yellow Gold',
        colorHex: '#d4af37',
        sku: 'LUNA-RG-ELYS-YG',
        price: 3499,
        stock: 24,
        imageUrl: '/src/assets/images/elys_ring_band_1790965068653.jpg',
        isDefault: true,
        isActive: true,
      },
      {
        id: 'var-elys-rg',
        productId: 'prod-elys-ring',
        colorName: 'Rose Gold',
        colorHex: '#b76e79',
        sku: 'LUNA-RG-ELYS-RG',
        price: 3499,
        stock: 14,
        imageUrl: '/src/assets/images/elys_ring_band_1790965068653.jpg',
        isDefault: false,
        isActive: true,
      },
      {
        id: 'var-elys-wg',
        productId: 'prod-elys-ring',
        colorName: 'White Gold',
        colorHex: '#e5e7eb',
        sku: 'LUNA-RG-ELYS-WG',
        price: 3499,
        stock: 8,
        imageUrl: '/src/assets/images/elys_ring_band_1790965068653.jpg',
        isDefault: false,
        isActive: true,
      }
    ],
    createdAt: '2026-09-22T09:15:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod-aurelia-choker',
    name: 'The Aurelia Pearl Choker',
    slug: 'the-aurelia-pearl-choker',
    category: 'Necklaces',
    collection: 'Solstice & Dawn',
    description: 'Lustrous hand-selected Akoya baroque pearls strung on pure Japanese silk thread, punctuated with solid gold beads and an architectural toggle closure.',
    materials: 'Genuine Freshwater Cultured Pearls (5.5mm - 6.0mm) / 14k Gold Clasp',
    dimensions: 'Length: 38cm with 4cm extender',
    careInstructions: 'Put pearls on after makeup and perfume. Keep away from excessive moisture.',
    basePrice: 4599,
    salePrice: 4299,
    rating: 4.9,
    reviewsCount: 67,
    isFeatured: false,
    isActive: true,
    images: [
      '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg'
    ],
    variations: [
      {
        id: 'var-aurelia-yg',
        productId: 'prod-aurelia-choker',
        colorName: 'Yellow Gold',
        colorHex: '#d4af37',
        sku: 'LUNA-NK-AURELIA-YG',
        price: 4299,
        stock: 15,
        imageUrl: '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
        isDefault: true,
        isActive: true,
      },
      {
        id: 'var-aurelia-sl',
        productId: 'prod-aurelia-choker',
        colorName: 'Sterling Silver',
        colorHex: '#e5e7eb',
        sku: 'LUNA-NK-AURELIA-SL',
        price: 3999,
        stock: 10,
        imageUrl: '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
        isDefault: false,
        isActive: true,
      }
    ],
    createdAt: '2026-09-25T16:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod-solstice-drops',
    name: 'The Solstice Drop Earrings',
    slug: 'the-solstice-drop-earrings',
    category: 'Earrings',
    collection: 'Solstice & Dawn',
    description: 'Sculptural cascading ear drops with fluid gold contours and bezel-set pear-cut accents that dance with natural motion.',
    materials: '18k Heavy Gold Micron Plating over Brass / Cubic Zirconia Baguettes',
    dimensions: 'Drop length: 48mm. Width: 8mm. Weight: 3.8g per ear',
    careInstructions: 'Gently wipe with soft dry cloth after wear.',
    basePrice: 3699,
    salePrice: null,
    rating: 4.7,
    reviewsCount: 42,
    isFeatured: false,
    isActive: true,
    images: [
      '/src/assets/images/seren_hoops_earrings_1790965047028.jpg'
    ],
    variations: [
      {
        id: 'var-solstice-yg',
        productId: 'prod-solstice-drops',
        colorName: 'Yellow Gold',
        colorHex: '#d4af37',
        sku: 'LUNA-ER-SOL-YG',
        price: 3699,
        stock: 19,
        imageUrl: '/src/assets/images/seren_hoops_earrings_1790965047028.jpg',
        isDefault: true,
        isActive: true,
      },
      {
        id: 'var-solstice-rg',
        productId: 'prod-solstice-drops',
        colorName: 'Rose Gold',
        colorHex: '#b76e79',
        sku: 'LUNA-ER-SOL-RG',
        price: 3699,
        stock: 11,
        imageUrl: '/src/assets/images/seren_hoops_earrings_1790965047028.jpg',
        isDefault: false,
        isActive: true,
      }
    ],
    createdAt: '2026-09-28T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  }
];

const initialSettings: StoreSettings = {
  currency: 'INR',
  currencySymbol: '₹',
  freeShippingThreshold: 1999,
  standardShippingFee: 149,
  taxRatePercent: 3,
  codEnabled: true,
  razorpayKeyId: 'rzp_test_luna_live_demo',
  stripePublishableKey: 'pk_test_luna_demo_key',
  storeName: 'LUNA Boutique',
  contactEmail: 'concierge@lunaboutique.com',
  contactPhone: '+91 98200 45890',
  address: '74 Heritage Boulevard, Colaba Causeway, Mumbai, MH 400001, India',
};

// Simple sha256 hash
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

class StoreDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse db.json, reinitializing default data:', err);
      }
    }

    const defaultAdmin: User & { passwordHash: string } = {
      id: 'usr-admin-1',
      name: 'Aditi Sharma',
      email: 'admin@lunaboutique.com',
      role: 'admin',
      phone: '+91 98200 45890',
      passwordHash: hashPassword('admin123'),
      createdAt: '2026-09-01T00:00:00Z',
    };

    const defaultCustomer: User & { passwordHash: string } = {
      id: 'usr-cust-1',
      name: 'Priyanka Kapoor',
      email: 'customer@example.com',
      role: 'customer',
      phone: '+91 98765 12340',
      passwordHash: hashPassword('password123'),
      createdAt: '2026-09-10T00:00:00Z',
    };

    const sampleOrders: Order[] = [
      {
        id: 'ord-1001',
        orderNumber: 'LUNA-2026-4821',
        userId: 'usr-cust-1',
        customerName: 'Priyanka Kapoor',
        customerEmail: 'customer@example.com',
        customerPhone: '+91 98765 12340',
        shippingAddress: {
          fullName: 'Priyanka Kapoor',
          phone: '+91 98765 12340',
          email: 'customer@example.com',
          addressLine1: 'B-402, Sea Green Apartments, Worli Sea Face',
          addressLine2: 'Near Flora Fountain',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400018',
          country: 'India',
        },
        items: [
          {
            productId: 'prod-lumi-necklace',
            productName: 'The Lumi Necklace',
            productSlug: 'the-lumi-necklace',
            variationId: 'var-lumi-yg',
            colorName: 'Yellow Gold',
            sku: 'LUNA-NK-LUMI-YG',
            price: 3899,
            quantity: 1,
            imageUrl: '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
            subtotal: 3899,
          },
          {
            productId: 'prod-elys-ring',
            productName: 'The Elys Ring',
            productSlug: 'the-elys-ring',
            variationId: 'var-elys-yg',
            colorName: 'Yellow Gold',
            sku: 'LUNA-RG-ELYS-YG',
            price: 3499,
            quantity: 1,
            imageUrl: '/src/assets/images/elys_ring_band_1790965068653.jpg',
            subtotal: 3499,
          }
        ],
        subtotal: 7398,
        shippingFee: 0,
        tax: 221.94,
        discount: 0,
        total: 7619.94,
        paymentMethod: 'cod',
        paymentStatus: 'completed',
        orderStatus: 'Shipped',
        trackingNumber: 'BLUEDART-8829410',
        trackingCarrier: 'Blue Dart Express',
        notes: 'Hand deliver with luxury gift packaging.',
        createdAt: '2026-09-30T14:20:00Z',
        updatedAt: '2026-10-01T09:10:00Z',
      },
      {
        id: 'ord-1002',
        orderNumber: 'LUNA-2026-5190',
        userId: null,
        customerName: 'Meera Deshmukh',
        customerEmail: 'meera.d@gmail.com',
        customerPhone: '+91 97112 34567',
        shippingAddress: {
          fullName: 'Meera Deshmukh',
          phone: '+91 97112 34567',
          email: 'meera.d@gmail.com',
          addressLine1: 'Villa 12, Palm Meadows, Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560066',
          country: 'India',
        },
        items: [
          {
            productId: 'prod-seren-hoops',
            productName: 'The Seren Hoops',
            productSlug: 'the-seren-hoops',
            variationId: 'var-seren-yg',
            colorName: 'Yellow Gold',
            sku: 'LUNA-ER-SEREN-YG',
            price: 3199,
            quantity: 1,
            imageUrl: '/src/assets/images/seren_hoops_earrings_1790965047028.jpg',
            subtotal: 3199,
          }
        ],
        subtotal: 3199,
        shippingFee: 0,
        tax: 95.97,
        discount: 0,
        total: 3294.97,
        paymentMethod: 'razorpay',
        paymentStatus: 'completed',
        orderStatus: 'Processing',
        notes: 'Gift message: Happy 30th Birthday Anya!',
        createdAt: '2026-10-01T16:45:00Z',
        updatedAt: '2026-10-01T17:00:00Z',
      }
    ];

    const initialInventoryLogs: InventoryLog[] = [
      {
        id: 'inv-init-1',
        productId: 'prod-lumi-necklace',
        productName: 'The Lumi Necklace',
        variationId: 'var-lumi-yg',
        sku: 'LUNA-NK-LUMI-YG',
        colorName: 'Yellow Gold',
        changeAmount: -1,
        previousStock: 23,
        newStock: 22,
        reason: 'Order #LUNA-2026-4821 fulfillment',
        orderId: 'ord-1001',
        timestamp: '2026-09-30T14:20:00Z',
      },
      {
        id: 'inv-init-2',
        productId: 'prod-seren-hoops',
        productName: 'The Seren Hoops',
        variationId: 'var-seren-yg',
        sku: 'LUNA-ER-SEREN-YG',
        colorName: 'Yellow Gold',
        changeAmount: -1,
        previousStock: 29,
        newStock: 28,
        reason: 'Order #LUNA-2026-5190 fulfillment',
        orderId: 'ord-1002',
        timestamp: '2026-10-01T16:45:00Z',
      }
    ];

    const schema: DatabaseSchema = {
      products: initialProducts,
      categories: initialCategories,
      collections: initialCollections,
      users: [defaultAdmin, defaultCustomer],
      orders: sampleOrders,
      inventoryLogs: initialInventoryLogs,
      settings: initialSettings,
    };

    this.saveData(schema);
    return schema;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      this.data = data;
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  // --- PRODUCTS ---
  getProducts(filters?: { category?: string; collection?: string; search?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Product[] {
    let list = this.data.products.filter(p => p.isActive);

    if (filters?.category && filters.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.collection && filters.collection !== 'all') {
      list = list.filter(p => p.collection.toLowerCase().includes(filters.collection!.toLowerCase()));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (filters?.minPrice !== undefined) {
      list = list.filter(p => p.basePrice >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      list = list.filter(p => p.basePrice <= filters.maxPrice!);
    }
    if (filters?.featured !== undefined) {
      list = list.filter(p => p.isFeatured === filters.featured);
    }

    return list;
  }

  getAllProductsAdmin(): Product[] {
    return this.data.products;
  }

  getProductById(idOrSlug: string): Product | undefined {
    return this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  createProduct(productInput: Partial<Product>): Product {
    const id = `prod-${Date.now()}`;
    const slug = (productInput.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id,
      name: productInput.name || 'Untitled Jewelry',
      slug: slug + '-' + Math.floor(Math.random() * 1000),
      category: productInput.category || 'Necklaces',
      collection: productInput.collection || 'The Luna Collection',
      description: productInput.description || '',
      materials: productInput.materials || '18k Gold Finish / Ethically Sourced',
      dimensions: productInput.dimensions || '',
      careInstructions: productInput.careInstructions || 'Polish with soft cloth.',
      basePrice: Number(productInput.basePrice) || 2999,
      salePrice: productInput.salePrice ? Number(productInput.salePrice) : null,
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: !!productInput.isFeatured,
      isActive: productInput.isActive !== undefined ? productInput.isActive : true,
      images: productInput.images && productInput.images.length > 0 ? productInput.images : ['/src/assets/images/lumi_necklace_pendant_1790965034619.jpg'],
      variations: (productInput.variations || []).map((v, i) => ({
        id: v.id || `var-${id}-${i + 1}`,
        productId: id,
        colorName: v.colorName || 'Yellow Gold',
        colorHex: v.colorHex || '#d4af37',
        sku: v.sku || `LUNA-${v.colorName?.slice(0, 2).toUpperCase() || 'YG'}-${Math.floor(Math.random() * 9000 + 1000)}`,
        price: Number(v.price) || Number(productInput.basePrice) || 2999,
        stock: Number(v.stock) || 10,
        imageUrl: v.imageUrl || (productInput.images && productInput.images[0]) || '/src/assets/images/lumi_necklace_pendant_1790965034619.jpg',
        isDefault: i === 0,
        isActive: true,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (newProduct.variations.length === 0) {
      newProduct.variations = [{
        id: `var-${id}-1`,
        productId: id,
        colorName: 'Yellow Gold',
        colorHex: '#d4af37',
        sku: `LUNA-YG-${Math.floor(Math.random() * 9000 + 1000)}`,
        price: newProduct.basePrice,
        stock: 15,
        imageUrl: newProduct.images[0],
        isDefault: true,
        isActive: true,
      }];
    }

    this.data.products.unshift(newProduct);
    this.saveData(this.data);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const current = this.data.products[index];
    const updated: Product = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.variations) {
      updated.variations = updates.variations.map((v, i) => ({
        ...v,
        id: v.id || `var-${id}-${i + 1}`,
        productId: id,
        price: Number(v.price),
        stock: Number(v.stock),
      }));
    }

    this.data.products[index] = updated;
    this.saveData(this.data);
    return updated;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- CATEGORIES & COLLECTIONS ---
  getCategories(): Category[] {
    return this.data.categories;
  }

  getCollections(): Collection[] {
    return this.data.collections;
  }

  // --- ORDERS & TRANSACTIONAL STOCK REDUCTION ---
  getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId);
    }
    return this.data.orders;
  }

  getOrderById(idOrNumber: string): Order | undefined {
    return this.data.orders.find(o => o.id === idOrNumber || o.orderNumber === idOrNumber);
  }

  createOrder(payload: {
    userId?: string | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: ShippingAddress;
    items: OrderItem[];
    paymentMethod: PaymentMethod;
    notes?: string;
  }): { success: boolean; order?: Order; error?: string } {
    // 1. Server-side validation of items & stock
    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: 'Cannot checkout with an empty cart.' };
    }

    // Verify stock and accurate prices from product catalog
    for (const item of payload.items) {
      const product = this.data.products.find(p => p.id === item.productId);
      if (!product) {
        return { success: false, error: `Product "${item.productName}" not found.` };
      }
      const variation = product.variations.find(v => v.id === item.variationId);
      if (!variation) {
        return { success: false, error: `Selected finish for "${item.productName}" is no longer available.` };
      }
      if (variation.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name} (${variation.colorName})". Only ${variation.stock} left in stock.`
        };
      }
    }

    // 2. Decrement inventory safely & record audit logs
    const orderNumber = `LUNA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;
    const timestamp = new Date().toISOString();

    let calculatedSubtotal = 0;
    const validatedItems: OrderItem[] = [];

    for (const item of payload.items) {
      const product = this.data.products.find(p => p.id === item.productId)!;
      const variation = product.variations.find(v => v.id === item.variationId)!;

      const previousStock = variation.stock;
      variation.stock -= item.quantity;
      const newStock = variation.stock;

      const itemPrice = variation.price;
      const itemSubtotal = itemPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variationId: variation.id,
        colorName: variation.colorName,
        sku: variation.sku,
        price: itemPrice,
        quantity: item.quantity,
        imageUrl: variation.imageUrl || product.images[0],
        subtotal: itemSubtotal,
      });

      // Log inventory change
      this.data.inventoryLogs.unshift({
        id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: product.id,
        productName: product.name,
        variationId: variation.id,
        sku: variation.sku,
        colorName: variation.colorName,
        changeAmount: -item.quantity,
        previousStock,
        newStock,
        reason: `Order #${orderNumber} placed`,
        orderId,
        timestamp,
      });
    }

    const shippingFee = calculatedSubtotal >= this.data.settings.freeShippingThreshold ? 0 : this.data.settings.standardShippingFee;
    const tax = Math.round((calculatedSubtotal * this.data.settings.taxRatePercent) / 100 * 100) / 100;
    const total = calculatedSubtotal + shippingFee + tax;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: payload.userId || null,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.shippingAddress,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shippingFee,
      tax,
      discount: 0,
      total,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'completed',
      orderStatus: 'Confirmed',
      notes: payload.notes || '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.data.orders.unshift(newOrder);
    this.saveData(this.data);

    return { success: true, order: newOrder };
  }

  updateOrderStatus(orderId: string, status: OrderStatus, tracking?: { carrier?: string; trackingNumber?: string }): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    const previousStatus = order.orderStatus;
    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();

    if (tracking?.carrier) order.trackingCarrier = tracking.carrier;
    if (tracking?.trackingNumber) order.trackingNumber = tracking.trackingNumber;

    // Handle inventory restoration if cancelled
    if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
      for (const item of order.items) {
        const product = this.data.products.find(p => p.id === item.productId);
        if (product) {
          const variation = product.variations.find(v => v.id === item.variationId);
          if (variation) {
            const previousStock = variation.stock;
            variation.stock += item.quantity;
            this.data.inventoryLogs.unshift({
              id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              productId: product.id,
              productName: product.name,
              variationId: variation.id,
              sku: variation.sku,
              colorName: variation.colorName,
              changeAmount: item.quantity,
              previousStock,
              newStock: variation.stock,
              reason: `Order #${order.orderNumber} cancelled - inventory restored`,
              orderId: order.id,
              timestamp: new Date().toISOString(),
            });
          }
        }
      }
    }

    this.saveData(this.data);
    return order;
  }

  // --- INVENTORY MANAGEMENT ---
  getInventoryLogs(): InventoryLog[] {
    return this.data.inventoryLogs;
  }

  adjustStock(productId: string, variationId: string, newStock: number, reason: string): { success: boolean; variation?: ProductVariation; error?: string } {
    const product = this.data.products.find(p => p.id === productId);
    if (!product) return { success: false, error: 'Product not found.' };

    const variation = product.variations.find(v => v.id === variationId);
    if (!variation) return { success: false, error: 'Variation not found.' };

    const previousStock = variation.stock;
    const change = newStock - previousStock;
    variation.stock = Math.max(0, newStock);

    this.data.inventoryLogs.unshift({
      id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: product.id,
      productName: product.name,
      variationId: variation.id,
      sku: variation.sku,
      colorName: variation.colorName,
      changeAmount: change,
      previousStock,
      newStock: variation.stock,
      reason: reason || 'Manual stock adjustment by admin',
      timestamp: new Date().toISOString(),
    });

    this.saveData(this.data);
    return { success: true, variation };
  }

  // --- STORE SETTINGS ---
  getSettings(): StoreSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData(this.data);
    return this.data.settings;
  }

  // --- USERS & AUTH ---
  findUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    const u = this.data.users.find(user => user.id === id);
    if (!u) return undefined;
    const { passwordHash, ...cleanUser } = u;
    return cleanUser;
  }

  registerUser(email: string, password: string, name: string, phone?: string): { success: boolean; user?: User; error?: string } {
    if (this.findUserByEmail(email)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: User & { passwordHash: string } = {
      id: `usr-${Date.now()}`,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      phone: phone?.trim(),
      role: 'customer',
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.saveData(this.data);

    const { passwordHash, ...userResponse } = newUser;
    return { success: true, user: userResponse };
  }

  verifyCredentials(email: string, password: string): User | null {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    const hashed = hashPassword(password);
    if (user.passwordHash !== hashed) return null;
    const { passwordHash, ...cleanUser } = user;
    return cleanUser;
  }

  // --- ANALYTICS DASHBOARD STATS ---
  getDashboardStats() {
    const totalOrders = this.data.orders.length;
    const totalSales = this.data.orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalProducts = this.data.products.length;
    
    // Low stock items (stock <= 10)
    const lowStockItems: { product: Product; variation: ProductVariation }[] = [];
    for (const prod of this.data.products) {
      for (const v of prod.variations) {
        if (v.stock <= 10) {
          lowStockItems.push({ product: prod, variation: v });
        }
      }
    }

    const recentOrders = this.data.orders.slice(0, 6);

    return {
      totalOrders,
      totalSales,
      totalProducts,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      recentOrders,
    };
  }
}

export const db = new StoreDatabase();
