
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, TrendingItem } from "../types";

const getSafeApiKey = (): string => {
  try {
    // @ts-ignore
    return (typeof process !== 'undefined' ? process.env?.API_KEY : '') || '';
  } catch (e) {
    return '';
  }
};

const getGemini = () => new GoogleGenAI({ apiKey: getSafeApiKey() });

const CACHE_KEY = 'nexus_pulse_cache_v4';
const FAIL_CACHE_KEY = 'nexus_fail_cooldown_v4';
const CACHE_EXPIRY = 1000 * 60 * 15; // 15 mins
const FAIL_COOLDOWN = 1000 * 60 * 2; // 2 min lockout on 429

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry(fn: () => Promise<any>, retries = 2, delay = 3000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error?.message?.toLowerCase() || "";
    const isRateLimit = errorMsg.includes('429') || 
                        errorMsg.includes('resource_exhausted') || 
                        errorMsg.includes('quota');
    
    if (isRateLimit && retries > 0) {
      await wait(delay);
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const fetchNexusPulse = async (): Promise<TrendingItem[]> => {
  const apiKey = getSafeApiKey();
  if (!apiKey) return [];
  
  const lastFail = sessionStorage.getItem(FAIL_CACHE_KEY);
  if (lastFail && (Date.now() - Number(lastFail) < FAIL_COOLDOWN)) return [];

  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY) return data;
  }

  const ai = getGemini();
  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Analyze current market trends for 'Back to School 2025' in South Africa. Identify 4 high-value deals from major retailers (Checkers, Makro, Takealot, Game). Provide Item, Price, Retailer.",
      config: { tools: [{ googleSearch: {} }] }
    }));

    const structured = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract exactly 4 deals from this text into a JSON array: ${response.text}. Fields: title, price (no R), retailer, savingReason, category.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              price: { type: Type.STRING },
              retailer: { type: Type.STRING },
              savingReason: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ['title', 'price', 'retailer']
          }
        }
      }
    }));

    const items = JSON.parse(structured.text || "[]");
    const pulseData = items.map((p: any, i: number) => ({
      ...p,
      id: `pulse-v4-${i}`,
      imageUrl: p.category?.toLowerCase().includes('uniform') 
        ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600'
        : p.category?.toLowerCase().includes('book')
        ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600'
        : 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=600',
      url: "#"
    }));

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: pulseData, timestamp: Date.now() }));
    return pulseData;
  } catch (e: any) {
    const errorMsg = e?.message?.toLowerCase() || "";
    if (errorMsg.includes('429')) {
      sessionStorage.setItem(FAIL_CACHE_KEY, Date.now().toString());
    }
    return []; 
  }
};

export const executeNexusDeepScan = async (query: string): Promise<AIResponse> => {
  const ai = getGemini();
  try {
    const scout = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `High-priority retail scan request for: "${query}" in South Africa. Compare stock and pricing across all major physical and digital nodes. Provide promo codes if active.`,
      config: { 
        tools: [{ googleSearch: {} }],
        systemInstruction: `
          You are the "Nexus Intelligence Analyst". 
          - Organize output with ### HEADERS.
          - Use a | Markdown | Table | for price comparisons.
          - Identify the **BEST VALUE** node clearly.
          - Keep language tactical, professional, and aggressive about savings.
          - Ensure all prices are in ZAR.
        `
      }
    }));

    const sources = (scout.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title || "Retail Verification Node", uri: c.web.uri }));

    return {
      text: scout.text || "System could not establish a clean data link.",
      sources,
      verifiedBy: "Nexus-Core-v4.5",
      status: 'SUCCESS'
    };
  } catch (error: any) {
    const errorMsg = error?.message?.toLowerCase() || "";
    const isRateLimit = errorMsg.includes('429');
    
    return { 
      text: isRateLimit 
        ? "### [SYSTEM ALERT]: QUOTA EXCEEDED\nHigh-density traffic has saturated the scan nodes. \n\n**Protocol:** Node recycling initiated. \n**Expected Reset:** 60-90 seconds. \n\nPlease standby while we re-establish the intelligence link." 
        : "### [ERROR]: SIGNAL LOSS\nConnection to retail nodes interrupted. Please re-verify the product query and launch again.", 
      sources: [], 
      status: 'ERROR' 
    };
  }
};
