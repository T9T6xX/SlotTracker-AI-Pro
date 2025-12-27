
import React from 'react';
import { MLAnalysis } from '../types';

interface MLDashboardProps {
  mlData: MLAnalysis;
  balance: number;
}

const MLDashboard: React.FC<MLDashboardProps> = ({ mlData, balance }) => {
  const getRiskColorClass = (risk: number) => {
    if (risk > 70) return 'text-red-500 stroke-red-500';
    if (risk > 30) return 'text-amber-500 stroke-amber-500';
    return 'text-emerald-500 stroke-emerald-500';
  };

  // Radial gauge calculations
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (mlData.churnRisk / 100) * circumference;

  return (
    <div className="glass rounded-3xl p-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 relative overflow-hidden group">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <i className="fas fa-brain text-white text-xl animate-pulse-slow"></i>
          </div>
          <div>
            <h3 className="font-black text-white uppercase tracking-tight text-lg">Predictive Behavioral Engine</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-[10px] text-emerald-500 font-mono font-bold tracking-widest uppercase">
                {mlData.isRateLimited ? 'Neural Link: Throttled' : 'Neural Link: Synchronized'}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">Simulated Liquidity</p>
          <p className="text-3xl font-black text-white mono bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Churn Risk Radial Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-900/40 rounded-3xl border border-slate-800/50">
          <div className="relative flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                strokeLinecap="round"
                fill="transparent"
                className={`${getRiskColorClass(mlData.churnRisk)}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-black mono ${getRiskColorClass(mlData.churnRisk).split(' ')[0]}`}>
                {mlData.churnRisk}%
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Churn Risk</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
             <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${mlData.churnRisk > 50 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
               {mlData.churnRisk > 70 ? 'Critical Alert' : mlData.churnRisk > 30 ? 'Elevated Monitoring' : 'Stable Retention'}
             </div>
          </div>
        </div>

        {/* Dynamic Metrics Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Next Deposit Probability</span>
                <p className="text-xs text-slate-400 font-medium">Neural prediction based on balance decay velocity</p>
              </div>
              <span className="text-2xl font-black text-blue-400 mono">{mlData.depositProbability}%</span>
            </div>
            <div className="flex gap-1 h-3 w-full">
              {Array.from({ length: 20 }).map((_, i) => {
                const isActive = (i / 20) * 100 < mlData.depositProbability;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm transition-all duration-700 ${
                      isActive 
                        ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                        : 'bg-slate-800'
                    }`}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  />
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/50 group/item hover:border-emerald-500/30 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Projected LTV</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-white mono">${mlData.projectedLTV.toLocaleString()}</p>
                <i className="fas fa-arrow-trend-up text-emerald-500 text-xs"></i>
              </div>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/50 group/item hover:border-blue-500/30 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Model Confidence</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-emerald-400 mono">{mlData.profitabilityConfidence}%</p>
                <i className="fas fa-shield-halved text-emerald-500/50 text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Impact Advisory Card */}
      <div className="mt-8 relative z-10">
        <div className={`p-6 bg-gradient-to-r ${mlData.isRateLimited ? 'from-amber-900/40 to-amber-950/40' : 'from-slate-900/80 to-slate-950/80'} rounded-2xl border ${mlData.isRateLimited ? 'border-amber-500/40' : 'border-emerald-500/20'} flex flex-col md:flex-row items-start md:items-center gap-6 transition-all duration-500`}>
          <div className={`w-14 h-14 rounded-full ${mlData.isRateLimited ? 'bg-amber-500/10' : 'bg-emerald-500/10'} flex items-center justify-center flex-shrink-0 border ${mlData.isRateLimited ? 'border-amber-500/20' : 'border-emerald-500/20'}`}>
            <i className={`fas ${mlData.isRateLimited ? 'fa-hourglass-half' : 'fa-comment-nodes'} ${mlData.isRateLimited ? 'text-amber-400' : 'text-emerald-400'} text-xl`}></i>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-1">
              <p className={`text-[10px] font-black ${mlData.isRateLimited ? 'text-amber-500' : 'text-emerald-500'} uppercase tracking-[0.2em]`}>
                {mlData.isRateLimited ? 'Quota Limit Reached' : 'Strategic Neural Advisory'}
              </p>
              {!mlData.isRateLimited && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[8px] font-black text-emerald-400 uppercase">Confidence</span>
                  <span className="text-[9px] font-bold text-white mono">{mlData.profitabilityConfidence}%</span>
                </div>
              )}
              {mlData.isCalculating && <i className="fas fa-spinner fa-spin text-emerald-500 text-[10px]"></i>}
            </div>
            <p className="text-slate-100 text-base leading-tight font-black mb-1">
              {mlData.isRateLimited ? 'Neural Processing Paused' : mlData.nextDepositSuggestion}
            </p>
            <p className="text-slate-400 text-xs italic font-medium">
              {mlData.isRateLimited 
                ? 'API Quota exhausted. The engine is waiting for the next telemetry window to open (approx 45s). Existing models active.' 
                : `Rationale: ${mlData.suggestionExplanation}`}
            </p>
          </div>
        </div>
      </div>

      {(mlData.isCalculating || mlData.isRateLimited) && (
        <div className={`absolute inset-0 ${mlData.isRateLimited ? 'bg-amber-950/30' : 'bg-slate-950/20'} backdrop-blur-[1px] flex items-center justify-center z-50 rounded-3xl transition-colors duration-500`}>
           <div className="flex flex-col items-center gap-2">
              <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${mlData.isRateLimited ? 'bg-amber-500' : 'bg-emerald-500'} w-1/2 animate-[loading_1.5s_infinite]`}></div>
              </div>
              <span className={`text-[8px] font-black ${mlData.isRateLimited ? 'text-amber-500' : 'text-emerald-500'} uppercase tracking-[0.3em]`}>
                {mlData.isRateLimited ? 'Recovering Quota...' : 'Recalculating Models'}
              </span>
           </div>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default MLDashboard;
