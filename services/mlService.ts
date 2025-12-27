
import { GoogleGenAI, Type } from "@google/genai";
import { SlotStats, MLAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const runMLBehavioralForecasting = async (
  totalStats: SlotStats[],
  currentBalance: number
): Promise<Partial<MLAnalysis>> => {
  try {
    const aggregateData = totalStats.reduce((acc, curr) => ({
      stakes: acc.stakes + curr.totalStakes,
      wins: acc.wins + curr.totalWins,
      spins: acc.spins + curr.totalSpins
    }), { stakes: 0, wins: 0, spins: 0 });

    const prompt = `
      You are a specialized Casino ML Model focusing on User Deposit Behavior.
      Analyze this user session data:
      - Current Simulated Wallet: $${currentBalance}
      - Total Wagered: $${aggregateData.stakes}
      - Total Payouts: $${aggregateData.wins}
      - Total Spins Across Portfolio: ${aggregateData.spins}
      - Net Position: $${aggregateData.wins - aggregateData.stakes}

      Predict:
      1. Churn Risk (0-100): High if balance is low and net position is deep negative.
      2. Projected LTV (Lifetime Value): Based on wager velocity.
      3. Next Deposit Suggestion: A short, tailored recommendation for when the user should "deposit" more simulated funds.
      4. Suggestion Explanation: A very brief (1 sentence) logical rationale for this suggestion based on the data trends.
      5. Profitability Confidence (0-100).

      Return strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            churnRisk: { type: Type.NUMBER },
            projectedLTV: { type: Type.NUMBER },
            depositProbability: { type: Type.NUMBER },
            profitabilityConfidence: { type: Type.NUMBER },
            nextDepositSuggestion: { type: Type.STRING },
            suggestionExplanation: { type: Type.STRING }
          },
          required: ["churnRisk", "projectedLTV", "depositProbability", "profitabilityConfidence", "nextDepositSuggestion", "suggestionExplanation"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return { ...result, isRateLimited: false };
  } catch (error: any) {
    console.warn("ML API Status:", error);
    
    // Specifically check for 429 Resource Exhausted
    const isQuotaError = 
      error?.status === 429 || 
      error?.message?.includes("RESOURCE_EXHAUSTED") || 
      error?.message?.includes("quota");

    if (isQuotaError) {
      return { isRateLimited: true };
    }

    return {
      churnRisk: 15,
      projectedLTV: 5000,
      depositProbability: 10,
      profitabilityConfidence: 85,
      nextDepositSuggestion: "Maintain current wager velocity.",
      suggestionExplanation: "API Connectivity issues. Using fallback heuristics.",
      isRateLimited: false
    };
  }
};
