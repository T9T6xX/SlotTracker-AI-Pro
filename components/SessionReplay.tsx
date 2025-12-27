import React, { useEffect, useRef } from 'react';
import * as rrweb from 'rrweb';

interface SessionReplayProps {
  events: any[];
  onClose: () => void;
}

const SessionReplay: React.FC<SessionReplayProps> = ({ events, onClose }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const replayerRef = useRef<any>(null);

  useEffect(() => {
    if (playerRef.current && events.length > 1) {
      playerRef.current.innerHTML = '';
      
      replayerRef.current = new rrweb.Replayer(events, {
        root: playerRef.current,
        autoPlay: true,
      });
      
      replayerRef.current.play();
    }

    return () => {
      if (replayerRef.current) {
        replayerRef.current.pause();
      }
    };
  }, [events]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <i className="fas fa-history text-blue-400"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Session Reconstruction</h2>
              <p className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase">Telemetry Playback Mode</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all text-slate-400 border border-slate-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="relative aspect-video bg-black rounded-3xl border border-slate-800 shadow-2xl overflow-hidden group">
          <div ref={playerRef} className="w-full h-full scale-[0.8] origin-center" />
          
          <div className="absolute inset-0 pointer-events-none border-[20px] border-slate-950/50 rounded-3xl"></div>
          <div className="absolute top-6 left-6 pointer-events-none">
            <div className="bg-blue-500/10 backdrop-blur-md px-3 py-1.5 rounded border border-blue-500/30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-blue-400 mono">REPLAY ACTIVE</span>
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"></div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700"
          >
            <i className="fas fa-times mr-2"></i>
            Close Replay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionReplay;