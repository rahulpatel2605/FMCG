import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CheckSquare, Sparkles, Tag, Gift, AlertCircle, ShoppingBag } from 'lucide-react';

export default function OrderView({ cart, onUpdateCartQty, onRemoveFromCart, onClearCart, onCheckout, products }) {

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  // Scheme Calculations Helper
  const calculateCartTotals = () => {
    let grossTotal = 0;
    let schemeDiscountAmount = 0;
    let freeGifts = []; // list of { name: string, qty: number, sku: string }

    const itemDetails = cart.map(item => {
      // Find full product info
      const prod = products.find(p => p.id === item.id) || item;
      const itemSubtotal = prod.price * item.qty;
      grossTotal += itemSubtotal;

      let appliedSchemeText = null;
      let lineSavings = 0;
      let earnedFreeQty = 0;

      // Apply Scheme Logic
      if (prod.schemeType === 'buy_x_get_y' && prod.schemeConfig) {
        const { triggerQty, freeQty } = prod.schemeConfig;
        if (item.qty >= triggerQty) {
          const cycles = Math.floor(item.qty / triggerQty);
          earnedFreeQty = cycles * freeQty;
          appliedSchemeText = `+${earnedFreeQty} Free Case${earnedFreeQty > 1 ? 's' : ''} earned`;
          freeGifts.push({
            name: `${prod.name} (Bonus Case)`,
            qty: earnedFreeQty,
            sku: prod.sku,
            gradient: prod.gradient
          });
        }
      } else if (prod.schemeType === 'percentage_discount' && prod.schemeConfig) {
        const { triggerQty, discountPercent } = prod.schemeConfig;
        if (item.qty >= triggerQty) {
          lineSavings = itemSubtotal * (discountPercent / 100);
          schemeDiscountAmount += lineSavings;
          appliedSchemeText = `${discountPercent}% Volume Discount (${formatCurrency(lineSavings)} saved)`;
        }
      }

      // Check for proximity to scheme triggers to nudge the user!
      let nudge = null;
      if (prod.schemeConfig) {
        const trigger = prod.schemeConfig.triggerQty;
        if (item.qty < trigger && item.qty >= trigger - 3) {
          const diff = trigger - item.qty;
          nudge = {
            qtyNeeded: diff,
            message: `Add ${diff} more case${diff > 1 ? 's' : ''} to unlock active scheme!`,
            targetQty: trigger
          };
        }
      }

      return {
        ...item,
        price: prod.price,
        gradient: prod.gradient,
        unitSize: prod.unitSize,
        sku: prod.sku,
        scheme: prod.scheme,
        subtotal: itemSubtotal,
        appliedSchemeText,
        lineSavings,
        earnedFreeQty,
        nudge
      };
    });

    const deliveryFee = grossTotal > 3000 || grossTotal === 0 ? 0 : 150.00;
    const netTotal = grossTotal - schemeDiscountAmount + deliveryFee;

    return {
      items: itemDetails,
      grossTotal,
      schemeDiscountAmount,
      freeGifts,
      deliveryFee,
      netTotal
    };
  };

  const cartSummary = calculateCartTotals();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Secondary Order Console</h2>
          <p className="text-sm text-slate-400 mt-0.5">Review dispatch details, review active trade discounts, and place bulk orders.</p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-400 hover:text-rose-400 text-[10px] font-bold rounded-lg transition-all duration-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Console
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-slate-950/20 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-slate-500">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-400">Order cart console is empty.</h4>
            <p className="text-xs text-slate-600 max-w-sm">Browse the Inventory Hub, inspect stock limits, and add products to queue a dispatch delivery.</p>
          </div>
        </div>
      ) : (
        /* Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main items panel */}
          <div className="lg:col-span-2 space-y-4">
            {cartSummary.items.map((item) => (
              <div 
                key={item.id}
                className="bg-gradient-to-br from-white/[0.03] to-white/[0.005] border border-white/5 rounded-2xl p-5 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${item.gradient}`} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
                  {/* Name and specs */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono bg-white/5 border border-white/5 text-slate-500 px-1.5 py-0.5 rounded">
                      {item.sku}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{item.name}</h3>
                    <p className="text-[10px] text-slate-400">{item.unitSize} &bull; {formatCurrency(item.price)}/case</p>
                  </div>

                  {/* Quantity adjustments */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateCartQty(item.id, item.qty - 1)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all border border-white/5"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    
                    <span className="w-10 text-center text-sm font-bold text-white">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => onUpdateCartQty(item.id, item.qty + 1)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all border border-white/5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-all border border-rose-500/10 ml-2"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price subtotal */}
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-semibold">Line Total</p>
                    <p className="text-sm font-black text-white">{formatCurrency(item.subtotal)}</p>
                  </div>
                </div>

                {/* Sub-elements for active schemes & notifications */}
                {(item.appliedSchemeText || item.nudge) && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2 pl-3">
                    {/* Applied Scheme */}
                    {item.appliedSchemeText && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/15 w-fit">
                        <Gift className="w-3.5 h-3.5 animate-bounce" />
                        {item.appliedSchemeText}
                      </div>
                    )}

                    {/* Reorder Nudge to unlock discount/free cases */}
                    {item.nudge && (
                      <button
                        onClick={() => onUpdateCartQty(item.id, item.nudge.targetQty)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-violet-400 bg-violet-500/5 hover:bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/15 transition-all text-left w-fit cursor-pointer animate-pulse"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                        <span>{item.nudge.message}</span>
                        <span className="text-[9px] bg-violet-600 text-white font-bold px-1.5 py-0.5 rounded ml-1">Unlock Now</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Checkout & Pricing ledger panel */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.005] border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Order Ledger
            </h3>

            {/* Pricing details */}
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Gross Total (cases)</span>
                <span className="text-slate-200 font-semibold">{cart.reduce((a, b) => a + b.qty, 0)} cases</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Gross Value</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(cartSummary.grossTotal)}</span>
              </div>

              {cartSummary.schemeDiscountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Scheme Discounts
                  </span>
                  <span className="font-bold">-{formatCurrency(cartSummary.schemeDiscountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Logistics Delivery</span>
                {cartSummary.deliveryFee === 0 ? (
                  <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/10">Free</span>
                ) : (
                  <span className="text-slate-200 font-semibold">{formatCurrency(cartSummary.deliveryFee)}</span>
                )}
              </div>

              {cartSummary.deliveryFee > 0 && (
                <p className="text-[9px] text-slate-500 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 inline mr-1" />
                  Add <span className="text-slate-300 font-bold">{formatCurrency(3000 - cartSummary.grossTotal)}</span> more to qualify for <span className="text-emerald-400 font-bold">Free Shipping</span>!
                </p>
              )}
            </div>

            {/* Free bonus gifts panel */}
            {cartSummary.freeGifts.length > 0 && (
              <div className="bg-cyan-500/5 border border-cyan-400/15 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 border-b border-cyan-400/10 pb-2 mb-1">
                  <Gift className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wide">Earned Margins Bonus</span>
                </div>
                <div className="space-y-2">
                  {cartSummary.freeGifts.map((gift, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[150px]">{gift.name}</span>
                      <span className="text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/10 px-2 py-0.5 rounded-md">+{gift.qty} Cases Free</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t border-white/5 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Net Order Value</span>
              <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                {formatCurrency(cartSummary.netTotal)}
              </span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => onCheckout(cartSummary)}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 via-cyan-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-500/15 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <CheckSquare className="w-4 h-4 fill-current" />
              Dispatch Order
            </button>

            <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <span>Orders process instantly and sync directly to secondary logistics ERP.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
