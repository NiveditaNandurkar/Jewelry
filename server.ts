import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', store: 'LUNA Boutique Fine Jewelry' });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req, res) => {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  });

  // Products
  app.get('/api/products', (req, res) => {
    const { category, collection, search, minPrice, maxPrice, featured } = req.query;
    const products = db.getProducts({
      category: category as string,
      collection: collection as string,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      featured: featured !== undefined ? featured === 'true' : undefined,
    });
    res.json(products);
  });

  app.get('/api/admin/products', (req, res) => {
    res.json(db.getAllProductsAdmin());
  });

  app.get('/api/products/:idOrSlug', (req, res) => {
    const product = db.getProductById(req.params.idOrSlug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/admin/products', (req, res) => {
    try {
      const created = db.createProduct(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create product' });
    }
  });

  app.put('/api/admin/products/:id', (req, res) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  });

  app.delete('/api/admin/products/:id', (req, res) => {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  });

  // Categories & Collections
  app.get('/api/categories', (req, res) => {
    res.json(db.getCategories());
  });

  app.get('/api/collections', (req, res) => {
    res.json(db.getCollections());
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    const userId = req.query.userId as string | undefined;
    res.json(db.getOrders(userId));
  });

  app.get('/api/orders/:idOrNumber', (req, res) => {
    const order = db.getOrderById(req.params.idOrNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.post('/api/orders', (req, res) => {
    const result = db.createOrder(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json(result.order);
  });

  app.put('/api/admin/orders/:id/status', (req, res) => {
    const { status, carrier, trackingNumber } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, { carrier, trackingNumber });
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  });

  // Inventory
  app.get('/api/admin/inventory/logs', (req, res) => {
    res.json(db.getInventoryLogs());
  });

  app.post('/api/admin/inventory/adjust', (req, res) => {
    const { productId, variationId, newStock, reason } = req.body;
    const result = db.adjustStock(productId, variationId, Number(newStock), reason);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // Admin Analytics Dashboard
  app.get('/api/admin/analytics', (req, res) => {
    res.json(db.getDashboardStats());
  });

  // Auth
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }
    const result = db.registerUser(email, password, name, phone);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ user: result.user, token: `tok-${result.user!.id}` });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = db.verifyCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    res.json({ user, token: `tok-${user.id}` });
  });

  // Newsletter subscription
  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    res.json({ success: true, message: 'Welcome to the inner circle of LUNA Boutique.' });
  });

  // Contact form submission
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }
    res.json({ success: true, message: 'Your message has been received by our concierge.' });
  });

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ LUNA Boutique server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
