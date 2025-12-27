
import { GoogleGenAI, Type } from "@google/genai";
import { SlotStats, SlotConfig, AIInsights } from "../types";

// Always use the standard initialization format with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsights = async (
  slotName: string,
  config: SlotConfig,
  stats: SlotStats
): Promise<AIInsights> => {
  try {
    const prompt = `
      You are an expert Slot Machine Statistician and "Bot Luck Forecaster".
      Analyze the current live simulation data for the slot "${slotName}":
      - Expected RTP: ${config.rtp}%
      - Current Live RTP: ${stats.liveRtp}%
      - Max Multiplier Hit: ${stats.maxMultiplier}x
      - Total Spins Tracked: ${stats.totalSpins}
      - Volatility Level: ${config.volatility}/20
      - Historical RTP Trend: ${stats.recentRtpHistory.slice(-5).join(', ')}

      Provide a quirky, professional, and insightful commentary (max 2 sentences).
      Forecast if the slot is "Hot", "Cold", or "Stable" based on the deviation from theoretical RTP.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commentary: { type: Type.STRING },
            luckForecast: { type: Type.STRING, enum: ["Hot", "Cold", "Stable"] }
          },
          required: ["commentary", "luckForecast"]
        }
      }
    });

    // Access text property directly from GenerateContentResponse
    const jsonStr = response.text?.trim() || "{}";
    const result = JSON.parse(jsonStr);
    return {
      commentary: result.commentary || "Stable performance detected.",
      luckForecast: result.luckForecast || "Stable",
      analysisTime: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error("AI Insight Error:", error);
    return {
      commentary: "Unable to process neural luck forecast at this time.",
      luckForecast: "Stable",
      analysisTime: new Date().toLocaleTimeString()
    };
  }
};
