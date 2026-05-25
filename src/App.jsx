import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import OrderView from './components/OrderView';
import SchemeView from './components/SchemeView';
import { INITIAL_PRODUCTS, ACTIVE_SCHEMES } from './data/mockData';
import { 
  Bell, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  TrendingUp, 
  Database,
  ArrowRight,
  Gift
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);
  
  // Custom Toast Alerts
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Nivea Body Wash inventory restocked (+50 cs)', type: 'info' },
    { id: 2, text: 'Active Scheme expiring soon: Colgate deal', type: 'warning' }
  ]);

  // Cart operations
  const handleAddToCart = (product, qty) => {
    const safeQty = Math.max(1, parseInt(qty) || 1);
    
    // Check stock
    if (safeQty > product.stock) {
      alert(`Cannot order ${safeQty} cases. Only ${product.stock} cases left in stock!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Check cumulative stock limit
        const totalQty = existing.qty + safeQty;
        if (totalQty > product.stock) {
          alert(`Cannot order ${totalQty} cases. Only ${product.stock} cases left in stock!`);
          return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: totalQty } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, qty: safeQty }];
    });

    // Proactive Toast Notification
    const newAlert = {
      id: Date.now(),
      text: `Queued ${safeQty} cases of ${product.name} to dispatch list`,
      type: 'success'
    };
    setNotifications(prev => [newAlert, ...prev.slice(0, 4)]);
  };

  const handleUpdateCartQty = (id, qty) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const safeQty = parseInt(qty) || 0;

    if (safeQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }

    if (safeQty > product.stock) {
      alert(`Insufficient stock. Only ${product.stock} cases available.`);
      return;
    }

    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: safeQty } : item
    ));
  };

  const handleRemoveFromCart = (id) => {
    const item = cart.find(c => c.id === id);
    setCart(prev => prev.filter(c => c.id !== id));
    
    if (item) {
      const newAlert = {
        id: Date.now(),
        text: `Removed ${item.name} from dispatch list`,
        type: 'info'
      };
      setNotifications(prev => [newAlert, ...prev.slice(0, 4)]);
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckout = (ledgerSummary) => {
    // 1. Deplete Inventory stocks based on checkout quantities
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const cartItem = cart.find(c => c.id === prod.id);
        const freeGiftItem = ledgerSummary.freeGifts.find(g => g.sku === prod.sku);
        
        let stockReduction = 0;
        if (cartItem) stockReduction += cartItem.qty;
        if (freeGiftItem) stockReduction += freeGiftItem.qty; // also deplete the free stock!
        
        return {
          ...prod,
          stock: Math.max(0, prod.stock - stockReduction)
        };
      });
    });

    // Save transaction summary for the success screen
    setLastOrderDetails({
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      itemsCount: cart.reduce((a, b) => a + b.qty, 0),
      freeGiftsCount: ledgerSummary.freeGifts.reduce((a, b) => a + b.qty, 0),
      savings: ledgerSummary.schemeDiscountAmount,
      totalNet: ledgerSummary.netTotal,
      freeItemsList: ledgerSummary.freeGifts
    });

    // Clear cart and trigger success telemetry overlay
    setCart([]);
    setCheckoutSuccess(true);
  };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Helper to trigger active searches from Schemes directory
  const handleSetSearchFilter = (term) => {
    setSearchFilter(term);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Fixed Sidebar navigation panel */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={(view) => {
          setActiveView(view);
          if (view !== 'inventory') setSearchFilter(''); // Clear search filter when leaving inventory
        }} 
        cartCount={cart.reduce((a, b) => a + b.qty, 0)} 
      />

      {/* Main viewport */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Global Dashboard Header */}
        <header className="h-20 bg-slate-950/40 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Live Node Network: Active &bull;
            </span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Secondary Logistics Hub
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Top alert bell */}
            <div className="relative group">
              <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
                <Bell className="w-4 h-4" />
              </button>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50 animate-pulse" />
              )}
            </div>

            {/* User status */}
            <div className="h-9 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                RA
              </div>
              <span className="text-xs font-semibold text-slate-300">Rahul Amin</span>
            </div>
          </div>
        </header>

        {/* Core Dynamic Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-20">
          {activeView === 'dashboard' && (
            <DashboardView 
              products={products} 
              schemes={ACTIVE_SCHEMES} 
              setActiveView={setActiveView} 
            />
          )}

          {activeView === 'inventory' && (
            <InventoryView 
              products={products} 
              onAddToCart={handleAddToCart}
              cart={cart}
            />
          )}

          {activeView === 'order' && (
            <OrderView 
              cart={cart} 
              onUpdateCartQty={handleUpdateCartQty} 
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
              products={products}
            />
          )}

          {activeView === 'schemes' && (
            <SchemeView 
              setActiveView={setActiveView} 
              setSearchFilter={handleSetSearchFilter} 
            />
          )}
        </main>
      </div>

      {/* Floating System Notifications Panel */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2.5 max-w-sm w-full">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            onClick={() => handleDismissNotification(notif.id)}
            className="glass-panel p-4 rounded-xl border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-cyan-400/30 transition-all duration-300 animate-fadeIn"
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${
                notif.type === 'success' ? 'bg-emerald-400' :
                notif.type === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'
              }`} />
              <p className="text-xs text-slate-300">{notif.text}</p>
            </div>
            <span className="text-[9px] text-slate-600 uppercase font-bold">Dismiss</span>
          </div>
        ))}
      </div>

      {/* Fullscreen Premium Telemetry Order Success Modal */}
      {checkoutSuccess && lastOrderDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel border border-cyan-400/20 bg-slate-950/90 p-8 text-center space-y-6 relative overflow-hidden animate-fadeIn">
            {/* Ambient Background Light */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl -z-10" />

            {/* Glowing Success Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-violet-600 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-400/20 pulse-neon">
              <CheckCircle2 className="w-8 h-8 text-slate-950 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white tracking-tight">Dispatch Queued Successfully</h3>
              <p className="text-xs text-slate-400">Order reference <span className="font-mono text-cyan-400 font-bold">{lastOrderDetails.orderId}</span> is sent to distribution nodes.</p>
            </div>

            {/* Transaction Data Card */}
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4.5 text-left space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Cases Ordered</span>
                <span className="text-slate-200 font-bold">{lastOrderDetails.itemsCount} cs</span>
              </div>
              
              {lastOrderDetails.freeGiftsCount > 0 && (
                <div className="flex justify-between items-center text-cyan-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" />
                    Bonus Margin Cases
                  </span>
                  <span>+{lastOrderDetails.freeGiftsCount} cs free</span>
                </div>
              )}

              {lastOrderDetails.savings > 0 && (
                <div className="flex justify-between items-center text-emerald-400 font-semibold">
                  <span>Trade Schemes Saved</span>
                  <span>-₹{lastOrderDetails.savings.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-white/5 pt-2.5 flex justify-between items-center text-sm font-bold">
                <span className="text-white">Total Dispatched</span>
                <span className="text-cyan-400">₹{lastOrderDetails.totalNet.toFixed(2)}</span>
              </div>
            </div>

            {/* Logistics Status Bar */}
            <div className="flex items-center gap-3 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-left text-xs">
              <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Secondary Logistics Status</p>
                <p className="text-slate-300 font-light mt-0.5">Assigned to Node-4 delivery route. Departure at 08:00 AM.</p>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setActiveView('dashboard');
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5"
            >
              Telemetry Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
