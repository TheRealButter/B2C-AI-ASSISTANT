
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, Category } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches the 4-5 best live school-related deals in South Africa right now.
 */
export const fetchTrendingSchoolDeals = async (): Promise<AIResponse> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Search for the top 5 active "Back to School" or educational equipment deals, sales, or promotions currently running in South Africa. 
      Look for specific offers from major retailers like Checkers, Makro, Takealot, PnP, and PEP. 
      Format each deal as a short high-impact bullet point with the retailer name and the specific saving.`,
      config: {
        tools: [{ googleSearch: {} }]
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title || "Retailer Source",
        uri: c.web.uri
      }));

    return { 
      text: response.text || "Scanning for live deals... check back in a moment.", 
      sources 
    };
  } catch (error) {
    console.error("Trending Deals Error:", error);
    return { text: "Market intelligence feed interrupted. Use the search bar for specific items.", sources: [] };
  }
};

/**
 * Enhanced Placement advice with support for Appeals and Late Applications
 */
export const getPlacementStrategicAdvice = async (
  province: string, 
  status: string, 
  task: 'ADVICE' | 'APPEAL' | 'AVAILABILITY', 
  userInput: string
): Promise<AIResponse> => {
  const ai = getAI();
  
  const prompts = {
    ADVICE: `Provide strategic advice for a parent whose school placement status is "${status}" in ${province}. Context: ${userInput}. Search for current 2025/2026 placement news.`,
    APPEAL: `Draft a professional, formal Appeal Letter template for a school rejection in ${province}. The parent's situation: ${userInput}. Use legal-sounding, procedural language appropriate for a District Appeal. Use [Placeholders] for personal names.`,
    AVAILABILITY: `Search for a list of public schools in ${province} that are still accepting late applications or have active waiting lists for 2025/2026. Mention specific closing dates if found.`
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompts[task],
      config: {
        tools: [{ googleSearch: {} }]
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title || "Government Update",
        uri: c.web.uri
      }));

    return { 
      text: response.text || "No data returned from mission control.", 
      sources 
    };
  } catch (error) {
    console.error("Strategic AI Error:", error);
    return { text: "Signal lost. Government portals are likely under heavy load. Please try again in 5 minutes.", sources: [] };
  }
};

/**
 * Existing searchRetailDeals for compatibility
 */
export const searchRetailDeals = async (query: string): Promise<AIResponse> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Find current prices and active "Back to School" deals in South Africa for: "${query}".`,
      config: { tools: [{ googleSearch: {} }] },
    });
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title || "Retailer", uri: c.web.uri }));
    return { text: response.text || "No deals found.", sources };
  } catch {
    return { text: "Retail feed error.", sources: [] };
  }
};

export const getPriceComparison = async (query: string): Promise<string> => {
  const ai = getAI();
  const res = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: `Price check: ${query} in SA.` });
  return res.text || "";
};

export const getBookSuggestions = async (title: string): Promise<string[]> => {
  const ai = getAI();
  try {
    const res = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview", 
      contents: `Suggest 5 textbooks similar to "${title}" in South Africa. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(res.text || "[]");
  } catch (error) {
    console.error("Book suggestions error:", error);
    return [];
  }
};

export const checkListingSafety = async (title: string, category: Category): Promise<{ safe: boolean; reason?: string }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate if this school marketplace listing title is safe and appropriate for parents: Title: "${title}", Category: "${category}". Return JSON with "safe" (boolean) and "reason" (string explaining why if unsafe).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["safe"]
        }
      }
    });
    return JSON.parse(response.text || '{"safe":true}');
  } catch (error) {
    console.error("Safety check error:", error);
    return { safe: true };
  }
};
