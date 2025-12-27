
import { SlotConfig, SlotStats } from './types';

export const SLOTS: SlotConfig[] = [
  {
    id: 'book-of-dead',
    name: 'Book of Dead',
    rtp: 96.21,
    hitFreq: 0.29,
    volatility: 5.0,
    color: '#fbbf24'
  },
  {
    id: 'razor-shark',
    name: 'Razor Shark',
    rtp: 96.70,
    hitFreq: 0.18,
    volatility: 12.0,
    color: '#06b6d4'
  },
  {
    id: 'sweet-bonanza',
    name: 'Sweet Bonanza',
    rtp: 96.48,
    hitFreq: 0.35,
    volatility: 3.5,
    color: '#ec4899'
  },
  {
    id: 'gates-of-olympus',
    name: 'Gates of Olympus',
    rtp: 96.50,
    hitFreq: 0.22,
    volatility: 9.0,
    color: '#8b5cf6'
  }
];

export const INITIAL_STATS_MAP: Record<string, SlotStats> = SLOTS.reduce((acc, slot) => {
  acc[slot.id] = {
    liveRtp: slot.rtp,
    totalSpins: 0,
    totalStakes: 0,
    totalWins: 0,
    maxMultiplier: 0,
    history: [],
    trend: 'neutral',
    recentRtpHistory: Array(20).fill(slot.rtp)
  };
  return acc;
}, {} as Record<string, SlotStats>);
