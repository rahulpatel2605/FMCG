import React from 'react';
import { LayoutDashboard, Boxes, ShoppingCart, Tag, Bell, Settings, TrendingUp } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, cartCount }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory Hub', icon: Boxes },
    { 
      id: 'order', 
      label: 'Order Cart', 
      icon: ShoppingCart,
      badge: cartCount > 0 ? cartCount : null
    },
    { id: 'schemes', label: 'Active Schemes', icon: Tag },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between h-screen fixed left-0 top-0 z-30">
      <div className="flex flex-col">
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              AETHERA
            </h1>
            <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest">
              FMCG Portal
            </span>
          </div>
        </div>

        {/* Navigation Options */}
        <nav className="p-4 space-y-1.5 flex-1">
          <div className="px-3 mb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Dealer Console
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/5 text-cyan-400 border-l-[3px] border-cyan-400 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className="text-sm">{item.label}</span>
                
                {/* Cart Badge */}
                {item.badge !== null && (
                  <span className="ml-auto bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full shadow-lg shadow-cyan-500/20 animate-pulse">
                    {item.badge}
                  </span>
                )}

                {/* Glass Glow effect behind active item */}
                {isActive && (
                  <div className="absolute inset-0 bg-cyan-400/5 rounded-xl blur-md -z-10" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dealer Profile & Footer settings */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center font-bold text-white text-sm">
            RD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">Rahul Distributors</p>
            <p className="text-[10px] text-slate-500 truncate">ID: DEL-584992</p>
          </div>
          <button className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-between items-center px-2 text-[10px] text-slate-600">
          <span>v1.0.0 Stable</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Sync Active
          </span>
        </div>
      </div>
    </aside>
  );
}
