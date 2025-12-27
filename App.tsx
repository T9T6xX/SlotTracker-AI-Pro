
import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as rrweb from 'rrweb';
import { SLOTS, INITIAL_STATS_MAP } from './constants';
import { SlotStats, SlotConfig, AIInsights, MLAnalysis } from './types';
import { runBatchSimulation } from './services/simulationEngine';
import { getAIInsights } from './services/geminiService';
import { runMLBehavioralForecasting } from './services/mlService';
import SlotCard from './components/SlotCard';
import RTPChart from './components/RTPChart';
import MLDashboard from './components/MLDashboard';
import SessionReplay from './components/SessionReplay';

const STAKE_OPTIONS = [0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 50.0, 100.0];

const INITIAL_ML: MLAnalysis = {
  churnRisk: 5,
  projectedLTV: 10000,
  depositProbability: 2,
  profitabilityConfidence: 95,
  nextDepositSuggestion: "Neural analysis initializing...",
  suggestionExplanation: "Calibrating baseline telemetry...",
  isCalculating: false,
  isRateLimited: false
};

const App: React.FC = () => {
  const [slotConfigs, setSlotConfigs] = useState<SlotConfig[]>(SLOTS);
  const [statsMap, setStatsMap] = useState<Record<string, SlotStats>>(INITIAL_STATS_MAP);
  const [activeSlots, setActiveSlots] = useState<Set<string>>(new Set(['book-of-dead', 'razor-shark']));
  const [selectedSlotId, setSelectedSlotId] = useState<string>('book-of-dead');
  const [aiInsights, setAiInsights] = useState<Record<string, AIInsights>>({});
  const [mlData, setMlData] = useState<MLAnalysis>(INITIAL_ML);
  const [simulatedBalance, setSimulatedBalance] = useState<number>(10000);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [globalStake, setGlobalStake] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Recording State Management
  const [isRecording, setIsRecording] = useState(false);
  const [recordedEvents, setRecordedEvents] = useState<any[]>([]);
  const [showReplay, setShowReplay] = useState(false);
  const eventsBufferRef = useRef<any[]>([]);
  const recordingStopFn = useRef<any>(null);

  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mlRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleRecording = () => {
    if (isRecording) {
      if (recordingStopFn.current) recordingStopFn.current();
      setIsRecording(false);
      setRecordedEvents([...eventsBufferRef.current]);
    } else {
      eventsBufferRef.current = [];
      setRecordedEvents([]);
      const stop = rrweb.record({
        emit(event) {
          eventsBufferRef.current.push(event);
        },
      });
      recordingStopFn.current = stop;
      setIsRecording(true);
    }
  };

  const toggleSlotTracking = (id: string) => {
    setActiveSlots(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleVolatilityChange = (id: string, newVolatility: number) => {
    setSlotConfigs(prev => prev.map(c => c.id === id ? { ...c, volatility: newVolatility } : c));
  };

  const processSimulations = useCallback(() => {
    if (isPaused) return;

    let totalStakesInBatch = 0;
    let totalWinsInBatch = 0;

    setStatsMap(prev => {
      const nextMap = { ...prev };
      activeSlots.forEach(slotId => {
        const config = slotConfigs.find(s => s.id === slotId);
        if (!config) return;

        const currentStats = nextMap[slotId];
        const batchResults = runBatchSimulation(config, 100, globalStake); 

        const batchStakes = batchResults.reduce((sum, r) => sum + r.stake, 0);
        const batchWins = batchResults.reduce((sum, r) => sum + r.win, 0);
        const batchMaxMulti = Math.max(...batchResults.map(r => r.multiplier));

        totalStakesInBatch += batchStakes;
        totalWinsInBatch += batchWins;

        const updatedTotalStakes = currentStats.totalStakes + batchStakes;
        const updatedTotalWins = currentStats.totalWins + batchWins;
        const newLiveRtp = updatedTotalStakes > 0 ? (updatedTotalWins / updatedTotalStakes) * 100 : config.rtp;

        nextMap[slotId] = {
          ...currentStats,
          liveRtp: newLiveRtp,
          totalSpins: currentStats.totalSpins + batchResults.length,
          totalStakes: updatedTotalStakes,
          totalWins: updatedTotalWins,
          maxMultiplier: Math.max(currentStats.maxMultiplier, batchMaxMulti),
          history: [...currentStats.history, ...batchResults].slice(-100),
          recentRtpHistory: [...currentStats.recentRtpHistory, newLiveRtp].slice(-30),
          trend: newLiveRtp > currentStats.liveRtp ? 'up' : 'down'
        };
      });

      return nextMap;
    });

    setSimulatedBalance(b => b - totalStakesInBatch + totalWinsInBatch);

  }, [activeSlots, globalStake, isPaused, slotConfigs]);

  useEffect(() => {
    if (!isPaused) {
      simulationRef.current = setInterval(processSimulations, 1000);
    } else {
      if (simulationRef.current) clearInterval(simulationRef.current);
    }
    return () => { if (simulationRef.current) clearInterval(simulationRef.current); };
  }, [processSimulations, isPaused]);

  const refreshML = async () => {
    // If we're already rate limited, maybe skip some cycles to let the quota recover
    if (mlData.isRateLimited) {
       console.log("Skipping ML refresh due to active rate limit...");
       // Still try to clear it after one skip cycle
       setMlData(prev => ({ ...prev, isRateLimited: false }));
       return;
    }

    setMlData(prev => ({ ...prev, isCalculating: true }));
    const statsArray = Object.values(statsMap) as SlotStats[];
    const forecast = await runMLBehavioralForecasting(statsArray, simulatedBalance);
    
    setMlData(prev => ({ 
      ...prev, 
      ...forecast, 
      isCalculating: false 
    }));
  };

  useEffect(() => {
    refreshML();
    // Reduce frequency to 45 seconds to respect free tier quotas
    mlRefreshRef.current = setInterval(refreshML, 45000);
    return () => { if (mlRefreshRef.current) clearInterval(mlRefreshRef.current); };
  }, []);

  const refreshAI = async () => {
    const config = slotConfigs.find(s => s.id === selectedSlotId);
    if (!config || isAiLoading) return;
    setIsAiLoading(true);
    const insight = await getAIInsights(config.name, config, statsMap[selectedSlotId]);
    setAiInsights(prev => ({ ...prev, [selectedSlotId]: insight }));
    setIsAiLoading(false);
  };

  useEffect(() => {
    refreshAI();
  }, [selectedSlotId]);

  const currentConfig = slotConfigs.find(s => s.id === selectedSlotId)!;
  const currentStats = statsMap[selectedSlotId];
  const currentAI = aiInsights[selectedSlotId];

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <i className="fas fa-chart-line text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">SlotTracker AI <span className="text-blue-500">PRO</span></h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-slate-500 font-mono uppercase">Engine v2.7.0</p>
              <div className="flex items-center gap-1">
                <div className={`h-1.5 w-1.5 rounded-full ${isPaused ? 'bg-slate-500' : 'bg-green-500 animate-pulse'}`}></div>
                <span className={`text-[10px] font-bold ${isPaused ? 'text-slate-500' : 'text-green-500'}`}>
                  {isPaused ? 'IDLE' : 'LIVE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
             <button 
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${
                isRecording 
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse' 
                : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <i className="fas fa-circle text-[8px]"></i>
              {isRecording ? 'STOP REC' : 'RECORD SESSION'}
            </button>
            {recordedEvents.length > 5 && !isRecording && (
              <button 
                onClick={() => setShowReplay(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest text-blue-400 hover:bg-blue-500/10 transition-all border-l border-slate-800"
              >
                <i className="fas fa-play"></i> REPLAY
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              isPaused 
              ? 'bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20' 
              : 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>

          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] text-slate-500 uppercase font-bold">Simulated Balance</span>
             <span className="text-sm font-bold mono text-emerald-400">
               ${simulatedBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}
             </span>
          </div>
        </div>
      </nav>

      {showReplay && (
        <SessionReplay events={recordedEvents} onClose={() => setShowReplay(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Monitored Assets</h2>
          {slotConfigs.map(slot => (
            <div key={slot.id} onClick={() => setSelectedSlotId(slot.id)}>
              <SlotCard 
                config={slot} 
                stats={statsMap[slot.id]} 
                isActive={activeSlots.has(slot.id)}
                onToggle={() => toggleSlotTracking(slot.id)}
                onVolatilityChange={(val) => handleVolatilityChange(slot.id, val)}
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <MLDashboard mlData={mlData} balance={simulatedBalance} />
          
          <div className="glass rounded-3xl p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-white">{currentConfig.name}</h2>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">ID: {currentConfig.id}</span>
                  <div className="bg-slate-900/60 p-1 px-2 rounded-lg border border-slate-800 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Stake:</span>
                    <select 
                      value={globalStake}
                      onChange={(e) => setGlobalStake(Number(e.target.value))}
                      className="bg-transparent text-blue-400 text-xs font-bold mono focus:outline-none"
                    >
                      {STAKE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-slate-900 text-white">${opt.toFixed(2)}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 uppercase font-bold">Theoretical RTP</p>
                   <p className="text-lg font-bold text-white mono">{currentConfig.rtp}%</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 uppercase font-bold">Variance</p>
                   <p className={`text-lg font-bold mono ${(currentStats.liveRtp - currentConfig.rtp) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(currentStats.liveRtp - currentConfig.rtp).toFixed(2)}%
                   </p>
                </div>
              </div>
            </div>

            <RTPChart data={currentStats.recentRtpHistory} baseRtp={currentConfig.rtp} color={currentConfig.color} />
          </div>

          <div className="glass rounded-3xl p-8 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center animate-pulse-slow">
                  <i className="fas fa-brain text-white"></i>
                </div>
                <h3 className="font-bold text-white">Gemini Luck Forecaster</h3>
              </div>
              <button onClick={refreshAI} disabled={isAiLoading} className="p-2 px-4 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold transition-all disabled:opacity-50">
                {isAiLoading ? 'SYNCING...' : 'REFRESH AI'}
              </button>
            </div>
            {currentAI ? (
              <p className="text-lg text-slate-300 italic font-medium leading-relaxed">"{currentAI.commentary}"</p>
            ) : (
              <div className="flex justify-center py-4 text-slate-500 font-mono text-sm">Initiating neural sync...</div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="mt-12 py-8 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
          SlotTracker AI Pro &copy; 2025 • ML Behavioral Analysis Engine Active
        </p>
      </footer>
    </div>
  );
};

export default App;
