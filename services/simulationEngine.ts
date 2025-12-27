
import { SlotConfig, SpinResult } from '../types';

export const calculateSpinResult = (stake: number, config: SlotConfig): SpinResult => {
  const isHit = Math.random() < config.hitFreq;
  
  if (!isHit) {
    return {
      win: 0,
      stake,
      multiplier: 0,
      timestamp: Date.now()
    };
  }

  // Log-normal distribution for volatility
  // High volatility = wider range, rare huge wins
  // Low volatility = consistent small wins
  const u = -0.5; // mean of the log
  const s = 0.5 + (config.volatility / 20); // standard deviation adjusted by volatility
  
  // Box-Muller transform for log-normal simulation
  const z = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());
  const logValue = Math.exp(u + s * z);
  
  let multiplier = logValue * (config.rtp / 100) * (1 / config.hitFreq);
  
  // Floor some small wins to keep it realistic
  if (multiplier < 0.1) multiplier = 0.1;
  
  // Cap extreme outliers just for simulation stability
  if (multiplier > 5000) multiplier = 5000;

  return {
    win: stake * multiplier,
    stake,
    multiplier: parseFloat(multiplier.toFixed(2)),
    timestamp: Date.now()
  };
};

export const runBatchSimulation = (
  config: SlotConfig, 
  iterations: number, 
  stake: number = 1.0
): SpinResult[] => {
  const results: SpinResult[] = [];
  for (let i = 0; i < iterations; i++) {
    results.push(calculateSpinResult(stake, config));
  }
  return results;
};
