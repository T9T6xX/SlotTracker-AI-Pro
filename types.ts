
export interface SlotConfig {
  id: string;
  name: string;
  rtp: number;
  hitFreq: number;
  volatility: number;
  color: string;
}

export interface SpinResult {
  win: number;
  stake: number;
  multiplier: number;
  timestamp: number;
}

export interface SlotStats {
  liveRtp: number;
  totalSpins: number;
  totalStakes: number;
  totalWins: number;
  maxMultiplier: number;
  history: SpinResult[];
  trend: 'up' | 'down' | 'neutral';
  recentRtpHistory: number[];
}

export interface AIInsights {
  commentary: string;
  luckForecast: 'Hot' | 'Cold' | 'Stable';
  analysisTime: string;
}

export interface MLAnalysis {
  churnRisk: number; // 0-100
  projectedLTV: number;
  depositProbability: number;
  profitabilityConfidence: number;
  nextDepositSuggestion: string;
  suggestionExplanation: string;
  isCalculating: boolean;
  isRateLimited?: boolean;
}

export enum GameState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED'
}
