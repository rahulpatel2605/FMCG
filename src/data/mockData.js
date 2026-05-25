// Aethera FMCG Mock Database - Diverse Consumer Products & Core Logistics Data

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    sku: 'BEV-PEP-250',
    name: 'Pepsi Carbonated Drink',
    brand: 'PepsiCo',
    category: 'Beverages',
    unitSize: '24 x 250ml Cans',
    price: 18.50,
    stock: 240,
    minThreshold: 50,
    maxCapacity: 500,
    gradient: 'from-blue-600 to-indigo-900',
    scheme: 'Buy 10 cases, Get 1 free',
    schemeType: 'buy_x_get_y',
    schemeConfig: { triggerQty: 10, freeQty: 1 }
  },
  {
    id: 'prod-002',
    sku: 'SNC-LAY-050',
    name: 'Lay\'s Classic Salted Chips',
    brand: 'PepsiCo',
    category: 'Snacks',
    unitSize: '40 x 50g Packs',
    price: 22.00,
    stock: 310,
    minThreshold: 60,
    maxCapacity: 600,
    gradient: 'from-yellow-500 to-amber-600',
    scheme: 'Buy 20 cases, Get 2 free',
    schemeType: 'buy_x_get_y',
    schemeConfig: { triggerQty: 20, freeQty: 2 }
  },
  {
    id: 'prod-003',
    sku: 'PC-COL-150',
    name: 'Colgate Total Toothpaste',
    brand: 'Colgate-Palmolive',
    category: 'Personal Care',
    unitSize: '12 x 150g Tubes',
    price: 34.20,
    stock: 85,
    minThreshold: 30,
    maxCapacity: 200,
    gradient: 'from-red-600 to-rose-900',
    scheme: 'Buy 5 cases, Get 1 free',
    schemeType: 'buy_x_get_y',
    schemeConfig: { triggerQty: 5, freeQty: 1 }
  },
  {
    id: 'prod-004',
    sku: 'FO-ORE-120',
    name: 'Oreo Double Stuf Biscuits',
    brand: 'Mondelēz International',
    category: 'Packaged Foods',
    unitSize: '24 x 120g Packs',
    price: 28.80,
    stock: 28, // Low Stock!
    minThreshold: 40,
    maxCapacity: 250,
    gradient: 'from-sky-700 to-indigo-950',
    scheme: '10% volume discount above 15 cases',
    schemeType: 'percentage_discount',
    schemeConfig: { triggerQty: 15, discountPercent: 10 }
  },
  {
    id: 'prod-005',
    sku: 'COS-NIV-250',
    name: 'Nivea Deep Impact Body Wash',
    brand: 'Beiersdorf',
    category: 'Cosmetics',
    unitSize: '12 x 250ml Bottles',
    price: 45.60,
    stock: 45,
    minThreshold: 20,
    maxCapacity: 150,
    gradient: 'from-blue-900 to-slate-900',
    scheme: '5% off on orders above 10 cases',
    schemeType: 'percentage_discount',
    schemeConfig: { triggerQty: 10, discountPercent: 5 }
  },
  {
    id: 'prod-006',
    sku: 'BEV-REB-250',
    name: 'Red Bull Energy Drink',
    brand: 'Red Bull GmbH',
    category: 'Beverages',
    unitSize: '24 x 250ml Cans',
    price: 48.00,
    stock: 120,
    minThreshold: 40,
    maxCapacity: 300,
    gradient: 'from-slate-700 to-slate-900',
    scheme: 'Buy 24 cases, Get 2 free',
    schemeType: 'buy_x_get_y',
    schemeConfig: { triggerQty: 24, freeQty: 2 }
  },
  {
    id: 'prod-007',
    sku: 'FO-MAG-280',
    name: 'Maggi 2-Minute Masala Noodles',
    brand: 'Nestlé',
    category: 'Packaged Foods',
    unitSize: '96 x 70g Singles',
    price: 19.20,
    stock: 420,
    minThreshold: 100,
    maxCapacity: 800,
    gradient: 'from-yellow-400 to-red-600',
    scheme: 'Buy 50 cases, Get 5 free',
    schemeType: 'buy_x_get_y',
    schemeConfig: { triggerQty: 50, freeQty: 5 }
  },
  {
    id: 'prod-008',
    sku: 'COS-LOR-200',
    name: 'L\'Oreal Paris Elvive Shampoo',
    brand: 'L\'Oréal',
    category: 'Cosmetics',
    unitSize: '12 x 200ml Bottles',
    price: 58.00,
    stock: 15, // Low Stock!
    minThreshold: 25,
    maxCapacity: 120,
    gradient: 'from-amber-600 to-yellow-950',
    scheme: 'Buy 10 cases, Get 1 free',
    schemeType: 'buy_x_get_y',
    schemeConfig: { triggerQty: 10, freeQty: 1 }
  }
];

export const ACTIVE_SCHEMES = [
  {
    id: 'sch-001',
    title: 'Pepsi Super Scheme',
    description: 'Order 10 or more cases of Pepsi Carbonated Drink and receive 1 case completely free. Boost your margins this summer!',
    eligibility: 'Minimum 10 cases of Pepsi (BEV-PEP-250)',
    benefit: '1 Free case per 10 cases ordered',
    expiry: 'Expires in 7 days'
  },
  {
    id: 'sch-002',
    title: 'Oreo Bulk Promotion',
    description: 'Bulk orders on Oreo Biscuits enjoy massive savings! Get an instant 10% off the product total for orders above 15 cases.',
    eligibility: 'Minimum 15 cases of Oreo (FO-ORE-120)',
    benefit: '10% Product Discount',
    expiry: 'Expires in 15 days'
  },
  {
    id: 'sch-003',
    title: 'Colgate Special Offer',
    description: 'Maintain dental supply shelves fully stocked. Order 5 cases of Colgate Total Toothpaste and get 1 extra case free.',
    eligibility: 'Minimum 5 cases of Colgate (PC-COL-150)',
    benefit: '1 Free case per 5 cases ordered',
    expiry: 'Expires in 4 days'
  },
  {
    id: 'sch-004',
    title: 'Nestle Maggi Mega Deal',
    description: 'The highest-velocity product in packaging foods! Order 50 cases of Maggi Noodles and get 5 cases completely free.',
    eligibility: 'Minimum 50 cases of Maggi (FO-MAG-280)',
    benefit: '5 Free cases per 50 cases ordered',
    expiry: 'Expires in 20 days'
  }
];

export const SALES_TREND_DATA = [
  { day: 'Mon', sales: 4200, orders: 12 },
  { day: 'Tue', sales: 5800, orders: 18 },
  { day: 'Wed', sales: 5100, orders: 14 },
  { day: 'Thu', sales: 7200, orders: 22 },
  { day: 'Fri', sales: 8900, orders: 25 },
  { day: 'Sat', sales: 6300, orders: 16 },
  { day: 'Sun', sales: 3400, orders: 9 }
];

export const STOCK_DISTRIBUTION = [
  { name: 'Beverages', value: 360, color: '#38bdf8' },
  { name: 'Snacks', value: 310, color: '#f59e0b' },
  { name: 'Packaged Foods', value: 448, color: '#e11d48' },
  { name: 'Personal Care', value: 85, color: '#f43f5e' },
  { name: 'Cosmetics', value: 60, color: '#8b5cf6' }
];

export const RECENT_LOGISTICS_LOGS = [
  { id: 'log-001', type: 'order', message: 'Order #ORD-9844 dispatched for delivery', time: '10 mins ago', status: 'success' },
  { id: 'log-002', type: 'stock', message: 'Oreo Biscuits inventory fell below safety limit', time: '1 hour ago', status: 'warning' },
  { id: 'log-003', type: 'payment', message: 'Invoice paid for Order #ORD-9812 (₹84,050.00)', time: '3 hours ago', status: 'success' },
  { id: 'log-004', type: 'stock', message: 'Maggi Noodles restocked (+200 cases)', time: '5 hours ago', status: 'success' },
  { id: 'log-005', type: 'stock', message: 'L\'Oreal Shampoo stock reached critical alert (15 cases left)', time: 'Yesterday', status: 'danger' }
];
