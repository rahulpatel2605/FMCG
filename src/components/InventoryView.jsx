import React, { useState } from 'react';
import { Search, AlertTriangle, AlertCircle, ShoppingCart, Check, Info } from 'lucide-react';

export default function InventoryView({ products, onAddToCart, cart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [orderQtys, setOrderQtys] = useState({}); // Stores inline order case counts

  const categories = ['All', 'Beverages', 'Snacks', 'Packaged Foods', 'Personal Care', 'Cosmetics'];

  // Handle inline quantity changing
  const handleQtyChange = (prodId, val) => {
    const qty = parseInt(val) || 0;
    setOrderQtys(prev => ({
      ...prev,
      [prodId]: Math.max(0, qty)
    }));
  };

  // Perform filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock, minThreshold) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    if (stock <= minThreshold) return { label: 'Critical Alert', color: 'text-rose-400', bg: 'bg-rose-500/10 border border-rose-500/20', alert: true };
    if (stock <= minThreshold * 1.5) return { label: 'Low Stock Warning', color: 'text-amber-400', bg: 'bg-amber-500/10 border border-amber-500/20', warning: true };
    return { label: 'In Stock (Healthy)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/10' };
  };

  const getStockPercentage = (stock, maxCapacity) => {
    return Math.min(100, Math.round((stock / maxCapacity) * 100));
  };

  const getSuggestedOrderQuantity = (product) => {
    if (product.stock <= product.minThreshold) {
      // Suggest restocking up to 70% of max capacity, rounded to nearest 5
      const restockTarget = Math.round((product.maxCapacity * 0.7) / 5) * 5;
      return Math.max(5, restockTarget - product.stock);
    }
    return 0; // Stock is healthy, no reorder suggested
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Panel */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Dealer Inventory Hub</h2>
        <p className="text-sm text-slate-400 mt-0.5">Browse product catalog, review stock levels, and place high-speed secondary dispatch orders.</p>
      </div>

      {/* Catalog Search and Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-950/40 p-4 border border-white/5 rounded-2xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search SKU, name, or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-xs rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border-cyan-400/50 text-cyan-400 font-semibold shadow-md shadow-cyan-400/5'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const status = getStockStatus(product.stock, product.minThreshold);
          const percent = getStockPercentage(product.stock, product.maxCapacity);
          const suggestedSOQ = getSuggestedOrderQuantity(product);
          const inlineQty = orderQtys[product.id] !== undefined ? orderQtys[product.id] : (suggestedSOQ > 0 ? suggestedSOQ : 1);
          
          const inCart = cart.find(item => item.id === product.id);

          return (
            <div 
              key={product.id}
              className="bg-gradient-to-br from-white/[0.03] to-white/[0.005] border border-white/5 rounded-2xl flex flex-col justify-between overflow-hidden relative group hover:border-white/10 transition-all duration-300 shadow-xl"
            >
              {/* Top Banner Accent */}
              <div className={`h-1.5 bg-gradient-to-r ${product.gradient}`} />

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Brand & SKU Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{product.brand}</span>
                    <h3 className="text-sm font-bold text-white leading-tight mt-0.5 group-hover:text-cyan-400 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono bg-white/5 border border-white/5 text-slate-400 px-1.5 py-0.5 rounded">
                    {product.sku}
                  </span>
                </div>

                {/* Logistics Info Card */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Unit Size</span>
                    <span className="text-slate-300 font-medium">{product.unitSize}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Stock Available</span>
                    <span className={`font-bold ${
                      product.stock <= product.minThreshold ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                    }`}>
                      {product.stock} Cases
                    </span>
                  </div>

                  {/* Stock Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-slate-500">
                      <span>Fulfillment Status</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          product.stock <= product.minThreshold 
                            ? 'bg-gradient-to-r from-rose-500 to-rose-400' 
                            : product.stock <= product.minThreshold * 1.5
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Warning Notice / Active Scheme Badge */}
                <div className="space-y-2">
                  {/* Stock Alert Label */}
                  <div className={`flex items-center gap-1.5 text-[9px] font-semibold px-2.5 py-1 rounded-md ${
                    product.stock <= product.minThreshold 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : product.stock <= product.minThreshold * 1.5
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                  }`}>
                    {product.stock <= product.minThreshold ? (
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                    ) : product.stock <= product.minThreshold * 1.5 ? (
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                    ) : (
                      <Check className="w-3 h-3 text-emerald-400" />
                    )}
                    {status.label}
                  </div>

                  {/* Scheme Incentive Tag */}
                  {product.scheme && (
                    <div className="bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-400/15 rounded-lg p-2 flex items-start gap-1.5 transition-colors">
                      <ShoppingCart className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-cyan-400 font-bold tracking-wide uppercase">Active Trade Deal</p>
                        <p className="text-[10px] text-slate-300 leading-tight mt-0.5">{product.scheme}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Label */}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-xs text-slate-500">Price Per Case</span>
                  <span className="text-base font-black text-white">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Placement Console */}
              <div className="p-4 bg-slate-950/60 border-t border-white/5 flex gap-2 items-center">
                {/* Quantity input */}
                <div className="w-20">
                  <label className="sr-only">Cases</label>
                  <input 
                    type="number" 
                    min="1"
                    max={product.stock > 0 ? product.stock : 1}
                    value={inlineQty === 0 ? '' : inlineQty}
                    onChange={(e) => handleQtyChange(product.id, e.target.value)}
                    placeholder="Cases"
                    disabled={product.stock <= 0}
                    className="w-full bg-slate-900 border border-white/10 hover:border-white/15 focus:border-cyan-400/50 focus:outline-none text-xs rounded-lg px-2 py-2 text-center text-white disabled:opacity-50"
                  />
                </div>

                {/* Add to order cart button */}
                <button
                  onClick={() => onAddToCart(product, inlineQty)}
                  disabled={product.stock <= 0 || inlineQty <= 0}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] font-bold rounded-lg transition-all duration-300 border ${
                    product.stock <= 0
                      ? 'bg-transparent border-white/5 text-slate-600 cursor-not-allowed'
                      : inCart
                      ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-400 hover:bg-emerald-500/15'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-white/20 active:scale-[0.98]'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {inCart ? `In Cart (${inCart.qty})` : 'Dispatch Cases'}
                </button>
              </div>

              {/* Predictive Smart Reorder Nudge (Overlay Banner) */}
              {suggestedSOQ > 0 && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-lg shadow-violet-600/35 border border-violet-400/30 flex items-center gap-1 animate-pulse">
                  <Info className="w-2.5 h-2.5" />
                  Smart SOQ: +{suggestedSOQ} cs
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-slate-950/20 border border-dashed border-white/5 rounded-2xl space-y-2">
          <p className="text-sm font-semibold text-slate-400">No FMCG products matches your filter criteria.</p>
          <p className="text-xs text-slate-600">Try adjusting your category selection or search phrase.</p>
        </div>
      )}
    </div>
  );
}
