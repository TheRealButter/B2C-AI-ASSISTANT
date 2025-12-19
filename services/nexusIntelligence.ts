
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, TrendingItem, Category } from "../types";

// Always initialize GoogleGenAI with the named parameter apiKey from process.env.API_KEY
const getGemini = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const CACHE_KEY = 'nexus_pulse_cache_prod_v1';
const FAIL_CACHE_KEY = 'nexus_pulse_fail_cooldown_v1';
const CACHE_EXPIRY = 1000 * 60 * 30; // 30 mins to save quota
const FAIL_COOLDOWN = 1000 * 60 * 1; // 1 minute lockout

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry(fn: () => Promise<any>, retries = 2, delay = 2500): Promise<any> {
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
  if (!process.env.API_KEY) return [];
  
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
      contents: "Scout for 4 'Back to School' deals currently available in South Africa. Item, ZAR Price, Retailer.",
      config: { tools: [{ googleSearch: {} }] }
    }));

    const structured = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Transform to JSON array (title, price, retailer, savingReason, category): ${response.text}`,
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
      id: `pulse-prod-${i}`,
      imageUrl: p.category === 'Uniforms' 
        ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600'
        : p.category === 'Textbooks'
        ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600'
        : 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=600',
      url: "#"
    }));

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: pulseData, timestamp: Date.now() }));
    return pulseData;
  } catch (e: any) {
    const errorMsg = e?.message?.toLowerCase() || "";
    if (errorMsg.includes('429') || errorMsg.includes('resource_exhausted')) {
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
      contents: `Deep-scan for: "${query}" in South Africa. Locate stock, current prices, and active promo codes.`,
      config: { 
        tools: [{ googleSearch: {} }],
        systemInstruction: `
          You are the "Nexus Intelligence Scanner". 
          1. Use clear ### SUMMARY and Markdown TABLES.
          2. Highlight best prices in **bold**.
          3. Ensure the tone is elite and technical but easy to read.
        `
      }
    }));

    const sources = (scout.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title || "Retail Intelligence Node", uri: c.web.uri }));

    return {
      text: scout.text || "Scan complete. No data streams captured.",
      sources,
      verifiedBy: "Nexus-Flash-V5",
      status: 'SUCCESS'
    };
  } catch (error: any) {
    const errorMsg = error?.message?.toLowerCase() || "";
    const isRateLimit = errorMsg.includes('429') || errorMsg.includes('resource_exhausted');
    
    return { 
      text: isRateLimit 
        ? "### [SYSTEM ALERT]: QUOTA REACHED\nThe Retail Intelligence Link is currently over-saturated. \n\nOur high-speed nodes are recycling to prevent a system lock. \n**Estimated Node Recovery:** 45-60 seconds. \n\nPlease standby and re-launch the scanner shortly." 
        : "### [ERROR]: SIGNAL LOST\nScanner link interrupted. Network nodes are recycling. Please attempt a re-launch in 60 seconds.", 
      sources: [], 
      status: 'ERROR' 
    };
  }
};
