import React from 'react';
import { Tag, Calendar, Gift, AlertCircle, ShoppingCart, Percent, Sparkles } from 'lucide-react';
import { ACTIVE_SCHEMES } from '../data/mockData';

export default function SchemeView({ setActiveView, setSearchFilter }) {
  
  const handleClaimScheme = (eligibilityText) => {
    // Extract a product keyword (like 'Pepsi', 'Oreo', 'Colgate', 'Maggi') to auto-filter the inventory search
    let searchWord = '';
    if (eligibilityText.includes('Pepsi')) searchWord = 'Pepsi';
    else if (eligibilityText.includes('Oreo')) searchWord = 'Oreo';
    else if (eligibilityText.includes('Colgate')) searchWord = 'Colgate';
    else if (eligibilityText.includes('Maggi')) searchWord = 'Maggi';

    if (searchWord) {
      setSearchFilter(searchWord);
    }
    setActiveView('inventory');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Active Brand Promotions</h2>
        <p className="text-sm text-slate-400 mt-0.5">Explore active trade discounts, bonus margins, and volume schemes offered directly by brand manufacturers.</p>
      </div>

      {/* Grid of Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ACTIVE_SCHEMES.map((scheme, idx) => {
          // Select gradient and icon based on title
          let gradient = 'from-cyan-500/10 to-violet-500/10 border-cyan-400/20 text-cyan-400';
          let icon = <Tag className="w-5 h-5" />;
          let glow = 'bg-cyan-400/5';

          if (scheme.title.includes('Pepsi')) {
            gradient = 'from-blue-600/10 via-indigo-600/5 to-slate-900 border-blue-500/20 text-blue-400';
            icon = <Sparkles className="w-5 h-5" />;
            glow = 'bg-blue-500/5';
          } else if (scheme.title.includes('Oreo')) {
            gradient = 'from-sky-500/10 via-blue-500/5 to-slate-900 border-sky-500/20 text-sky-400';
            icon = <Percent className="w-5 h-5" />;
            glow = 'bg-sky-400/5';
          } else if (scheme.title.includes('Colgate')) {
            gradient = 'from-rose-600/10 via-red-600/5 to-slate-900 border-rose-500/20 text-rose-400';
            icon = <Gift className="w-5 h-5" />;
            glow = 'bg-rose-500/5';
          } else if (scheme.title.includes('Maggi')) {
            gradient = 'from-amber-500/10 via-yellow-500/5 to-slate-900 border-amber-500/20 text-amber-400';
            icon = <Gift className="w-5 h-5 animate-pulse" />;
            glow = 'bg-amber-400/5';
          }

          return (
            <div 
              key={scheme.id}
              className={`bg-gradient-to-br ${gradient} border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 shadow-xl`}
            >
              {/* Blur glow effect */}
              <div className={`absolute -top-12 -right-12 w-32 h-32 ${glow} rounded-full blur-2xl -z-10`} />

              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {scheme.title}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{scheme.id}</span>
                    </div>
                  </div>
                  
                  {/* Expiration badge */}
                  <span className="flex items-center gap-1 text-[9px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded-full border border-white/5">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {scheme.expiry}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {scheme.description}
                </p>

                {/* Eligibility criteria */}
                <div className="p-3.5 bg-slate-950/60 border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eligibility Rule</h4>
                      <p className="text-slate-200 mt-0.5">{scheme.eligibility}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and Benefit details */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Margin Benefit</span>
                  <p className="text-sm font-extrabold text-emerald-400">{scheme.benefit}</p>
                </div>

                <button
                  onClick={() => handleClaimScheme(scheme.eligibility)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-lg transition-all duration-300 border border-white/10 hover:border-white/20 active:scale-[0.98] flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Order Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
