
import { GoogleGenAI } from "@google/genai";
import { AIResponse, TrendingItem, Category } from "../types";

const getGemini = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const CACHE_KEY = 'nexus_pulse_cache';
const CACHE_EXPIRY = 1000 * 60 * 15; // 15 minutes

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Robust wrapper for Gemini API calls with exponential backoff for rate limits (429)
 */
async function callWithRetry(fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429 || error?.error?.code === 429;
    if (isRateLimit && retries > 0) {
      console.warn(`Nexus Node rate limited. Retrying in ${delay}ms... (${retries} attempts left)`);
      await wait(delay);
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const fetchNexusPulse = async (): Promise<TrendingItem[]> => {
  // Check session cache first
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data;
    }
  }

  const ai = getGemini();
  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: "Find 4 major 'Back to School' deals currently live in South Africa. Return only Item, Price in ZAR, and Retailer.",
      config: { tools: [{ googleSearch: {} }] }
    }));

    const structPrompt = `Transform this data into a JSON array of 4 objects. 
    Keys: title, price, retailer, savingReason, category (Textbooks, Uniforms, Stationery).
    Data: ${response.text}`;

    const structured = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: structPrompt,
      config: { responseMimeType: "application/json" }
    }));

    const items = JSON.parse(structured.text || "[]");

    const pulseData = items.map((p: any, i: number) => ({
      ...p,
      id: `pulse-${i}`,
      imageUrl: p.category === 'Uniforms' 
        ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600'
        : p.category === 'Textbooks'
        ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600'
        : 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=600',
      url: "#"
    }));

    // Save to cache
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: pulseData, timestamp: Date.now() }));
    return pulseData;
  } catch (e: any) {
    console.error("Pulse Engine Critical Error:", e);
    throw e; // Throw so UI can handle error state
  }
};

export const executeNexusDeepScan = async (query: string): Promise<AIResponse> => {
  const ai = getGemini();
  try {
    const scout = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a retail deep-scan for: "${query}" in South Africa. Locate live stock, current prices, and active promo codes.`,
      config: { tools: [{ googleSearch: {} }] }
    }));

    const formatter = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Format this search intelligence: ${scout.text}`,
      config: { 
        systemInstruction: `
          You are the Mistral-Formatting Node. Your ONLY job is to take raw data and output it as beautiful, structured Markdown.
          1. Use BOLD for retailer names.
          2. Use a Markdown Table if price comparisons for multiple retailers exist.
          3. Use distinct bullet points for item features or "Pro Tips".
          4. Ensure headers use ### for visual hierarchy.
          5. Keep it clean and professional.
        `
      }
    }));

    const sources = (scout.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title || "Retailer Source", uri: c.web.uri }));

    return {
      text: formatter.text || "Scan complete. No data formatted.",
      sources,
      verifiedBy: "Groq-Llama3-Node",
      status: 'SUCCESS'
    };
  } catch (error: any) {
    console.error("Scan Execution Failure:", error);
    const isRateLimit = error?.message?.includes('429');
    return { 
      text: isRateLimit 
        ? "Intelligence nodes are currently at max capacity. Please wait a few seconds and try your scan again." 
        : "Scan link interrupted. Our high-speed nodes are recycling. Please try again.", 
      sources: [], 
      status: 'ERROR' 
    };
  }
};
