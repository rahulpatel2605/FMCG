import React from 'react';
import { 
  TrendingUp, 
  Boxes, 
  Activity, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight, 
  PackageCheck,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  SALES_TREND_DATA, 
  STOCK_DISTRIBUTION, 
  RECENT_LOGISTICS_LOGS 
} from '../data/mockData';

export default function DashboardView({ products, schemes, setActiveView }) {
  // Calculations
  const totalStockValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
  const totalCases = products.reduce((acc, curr) => acc + curr.stock, 0);
  
  const lowStockProducts = products.filter(p => p.stock <= p.minThreshold);
  const stockHealthPercent = Math.round(((products.length - lowStockProducts.length) / products.length) * 100);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-2xl">
          <p className="text-xs text-slate-400 font-medium mb-1">{payload[0].payload.day ? `Day: ${payload[0].payload.day}` : payload[0].name}</p>
          <p className="text-sm font-bold text-cyan-400">
            Sales: {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.orders && (
            <p className="text-xs text-violet-400 mt-0.5">
              Orders: {payload[0].payload.orders} cases
            </p>
          )}
        </div>
      );
    };
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dynamic Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Executive Telemetry</h2>
          <p className="text-sm text-slate-400 mt-0.5">Real-time dealer supply metrics and operations dashboard.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveView('order')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-300 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Quick Reorder
          </button>
        </div>
      </div>

      {/* KPI Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl -z-10 group-hover:bg-cyan-400/10 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory Value</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/10 text-cyan-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">{formatCurrency(totalStockValue)}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              Total: <span className="text-slate-300 font-semibold">{totalCases} Cases</span> across all categories
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-[10px] text-emerald-400 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            +4.2% from last week
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-violet-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-400/5 rounded-full blur-2xl -z-10 group-hover:bg-violet-400/10 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Supply Health</span>
            <div className={`p-2 rounded-xl border text-sm font-bold flex items-center justify-center ${
              stockHealthPercent > 80 
                ? 'bg-emerald-500/10 border-emerald-400/10 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-400/10 text-amber-400'
            }`}>
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">{stockHealthPercent}%</h3>
            <p className="text-xs text-slate-500">
              {lowStockProducts.length > 0 
                ? `${lowStockProducts.length} items require reordering alert`
                : 'All stock levels healthy'
              }
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-[10px] text-slate-400 font-medium">
            <Activity className="w-3.5 h-3.5 mr-1" />
            Stockout risk evaluation: Low
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-rose-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-400/5 rounded-full blur-2xl -z-10 group-hover:bg-rose-400/10 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Deals</span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-400/10 text-rose-400">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">{schemes.length}</h3>
            <p className="text-xs text-slate-500">Promotions active in your region</p>
          </div>
          <button 
            onClick={() => setActiveView('schemes')}
            className="mt-4 pt-3 border-t border-white/5 flex items-center text-[10px] text-cyan-400 hover:text-cyan-300 font-bold w-full text-left"
          >
            Explore Schemes Directory &rarr;
          </button>
        </div>

        {/* KPI 4 */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl -z-10 group-hover:bg-amber-400/10 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Out of Stock Alerts</span>
            <div className={`p-2 rounded-xl ${
              lowStockProducts.length > 0 
                ? 'bg-rose-500/15 border border-rose-500/20 text-rose-400 animate-pulse'
                : 'bg-emerald-500/10 border border-emerald-400/10 text-emerald-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {lowStockProducts.length}
            </h3>
            <p className="text-xs text-slate-500">Items below minimum stock threshold</p>
          </div>
          <button 
            onClick={() => setActiveView('inventory')}
            className="mt-4 pt-3 border-t border-white/5 flex items-center text-[10px] text-amber-400 hover:text-amber-300 font-bold w-full text-left"
          >
            {lowStockProducts.length > 0 ? 'Review & restock immediately' : 'Check inventory grid'} &rarr;
          </button>
        </div>
      </div>

      {/* Graphical Insights Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Sales Trend */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.02] to-white/[0.005] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Secondary Sales Flow</h4>
              <p className="text-xs text-slate-500 mt-0.5">Dealer distribution trends updated hourly</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-[10px] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              Live Feed
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_TREND_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown */}
        <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.005] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Inventory Weight Allocation</h4>
            <p className="text-xs text-slate-500 mt-0.5">Total stock cases by category</p>
          </div>

          <div className="h-44 w-full my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STOCK_DISTRIBUTION} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950/90 border border-white/10 p-2.5 rounded-lg text-xs">
                          <p className="font-bold text-slate-200">{payload[0].name}</p>
                          <p className="text-cyan-400 font-semibold mt-0.5">{payload[0].value} Cases</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {STOCK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2">
            {STOCK_DISTRIBUTION.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-slate-200">{item.value} cs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logistics & Alerts Terminal Panel */}
      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4.5 h-4.5 text-cyan-400" />
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Live System Logs</h4>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />
        </div>

        <div className="space-y-3 font-mono text-xs">
          {RECENT_LOGISTICS_LOGS.map((log) => (
            <div 
              key={log.id} 
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{log.time}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  log.status === 'success' ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50' : 
                  log.status === 'warning' ? 'bg-amber-400 shadow-lg shadow-amber-500/50' : 
                  'bg-rose-500 shadow-lg shadow-rose-500/50 animate-ping'
                }`} />
              </div>
              <p className="text-slate-300 flex-1 group-hover:text-white transition-colors">{log.message}</p>
              <div className="text-[9px] px-1.5 py-0.5 rounded border uppercase font-semibold select-none text-slate-500 border-slate-800">
                {log.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
