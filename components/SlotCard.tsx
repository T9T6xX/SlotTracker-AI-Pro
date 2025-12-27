
import React from 'react';
import { SlotConfig, SlotStats } from '../types';

interface SlotCardProps {
  config: SlotConfig;
  stats: SlotStats;
  isActive: boolean;
  onToggle: () => void;
  onVolatilityChange: (newVolatility: number) => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ config, stats, isActive, onToggle, onVolatilityChange }) => {
  const rtpDiff = stats.liveRtp - config.rtp;
  const isPositive = rtpDiff >= 0;

  // Helper to determine color and glow based on multiplier
  const getWinTierStyles = (multiplier: number) => {
    if (multiplier <= 0) return 'bg-slate-800 border-slate-700';
    if (multiplier < 5) return 'bg-emerald-600 border-emerald-500/50';
    if (multiplier < 25) return 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]';
    return 'bg-yellow-400 border-yellow-200 shadow-[0_0_12px_rgba(250,204,21,0.5)] animate-pulse';
  };

  return (
    <div 
      className={`glass rounded-2xl p-5 transition-all duration-300 relative group border-l-4 ${isActive ? 'ring-2 ring-blue-500/50 scale-[1.02]' : 'hover:scale-[1.01]'}`}
      style={{ borderLeftColor: config.color }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {config.name}
          </h3>
          <div className="mt-1 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                Telemetry Volatility
              </p>
              <span className="text-[10px] font-bold text-blue-400 mono bg-blue-500/10 px-1 rounded">
                {config.volatility.toFixed(1)}/20
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={config.volatility}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onVolatilityChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors whitespace-nowrap ml-2 ${isActive ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'}`}
        >
          {isActive ? 'Stop' : 'Track'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Live RTP</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold mono ${stats.liveRtp > 100 ? 'text-green-400' : 'text-slate-100'}`}>
              {stats.liveRtp.toFixed(2)}%
            </span>
            <span className={`text-[10px] font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '↑' : '↓'}{Math.abs(rtpDiff).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Max Multi</p>
          <span className="text-2xl font-bold mono text-blue-400">
            {stats.maxMultiplier.toFixed(0)}x
          </span>
        </div>

        {/* Dedicated Total Returns Section */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/10 col-span-2 relative overflow-hidden group/wins">
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tighter">Total Simulated Returns</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black mono text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                  ${stats.totalWins.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {stats.totalWins > 0 && <i className="fas fa-caret-up text-emerald-500 text-xs animate-bounce"></i>}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/5 flex items-center justify-center border border-emerald-500/20 group-hover/wins:scale-110 transition-transform">
              <i className="fas fa-coins text-emerald-500/70"></i>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl rounded-full"></div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2 items-center">
            <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stats.totalSpins.toLocaleString()} SPINS TRACKED</span>
          </div>
          <span className="text-[10px] text-slate-600 font-bold uppercase">Sequence</span>
        </div>
        
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
           {stats.history.slice(-12).map((h, i) => (
             <div 
              key={i} 
              className={`w-5 h-6 rounded flex-shrink-0 border flex items-center justify-center transition-transform hover:scale-110 relative group/spin ${getWinTierStyles(h.multiplier)}`}
             >
               {/* Tooltip with enhanced alongside layout */}
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/spin:block z-[60]">
                 <div className="bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg border border-slate-700 whitespace-nowrap shadow-2xl flex items-center gap-2">
                   {h.win > 0 ? (
                     <>
                       <div className="flex items-baseline gap-0.5">
                         <span className="text-emerald-400 font-black text-xs">{h.multiplier}</span>
                         <span className="text-emerald-500/80 text-[8px] font-bold">x</span>
                       </div>
                       <div className="w-[1px] h-3 bg-slate-700 mx-0.5"></div>
                       <span className="text-slate-100 mono font-bold text-xs">${h.win.toFixed(2)}</span>
                     </>
                   ) : (
                     <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Miss</span>
                   )}
                   {/* Tooltip arrow pointer */}
                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                 </div>
               </div>
               {/* Minimalist dot indicator for the sequence */}
               {h.win > 0 && <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-sm animate-pulse"></div>}
             </div>
           ))}
           {stats.history.length === 0 && (
             <div className="w-full h-6 border border-dashed border-slate-800 rounded flex items-center justify-center">
               <span className="text-[9px] text-slate-700 font-mono italic">Waiting for telemetry...</span>
             </div>
           )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div 
          className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-5"
          style={{ backgroundColor: config.color }}
        ></div>
      </div>
    </div>
  );
};

export default SlotCard;
