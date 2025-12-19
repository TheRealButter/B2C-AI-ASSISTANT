
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, Category } from "../types";

// Always initialize GoogleGenAI with the named parameter apiKey from process.env.API_KEY
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPlacementStrategicAdvice = async (
  province: string, 
  status: string, 
  task: 'ADVICE' | 'APPEAL' | 'AVAILABILITY', 
  userInput: string
): Promise<AIResponse> => {
  const ai = getAI();
  
  const prompts = {
    ADVICE: `Provide strategic advice for a parent whose school placement status is "${status}" in ${province}. Context: ${userInput}.`,
    APPEAL: `Draft a professional Appeal Letter template for a school rejection in ${province}. Parent's situation: ${userInput}.`,
    AVAILABILITY: `Search for public schools in ${province} that still have active waiting lists or late registration for 2025/2026.`
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompts[task],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `
          You are the "Nexus Strategic Advocate". Perfectly organized output only.
          1. Structure with ### HEADERS.
          2. **Bold critical terms**.
          3. Use bulleted lists for steps.
          4. Cite specific DOE/SA Schools Act sections where applicable.
        `
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title || "Department Source",
        uri: c.web.uri
      }));

    return { 
      text: response.text || "NO_STRATEGIC_DATA", 
      sources 
    };
  } catch (error: any) {
    const errorMsg = error?.message?.toLowerCase() || "";
    if (errorMsg.includes('429') || errorMsg.includes('resource_exhausted')) {
      return { 
        text: "### [SYSTEM ALERT]: NODE RECYCLING\nThe Strategic Advice Node is currently under heavy load (Quota 429). \n\nPlease wait 60 seconds for the Department of Education data link to reset.", 
        sources: [] 
      };
    }
    return { text: "### [SIGNAL ERROR]: INTERRUPTED\nConnection to strategic portals lost. Re-attempt advised in 5 minutes.", sources: [] };
  }
};

export const getPriceComparison = async (query: string): Promise<string> => {
  const ai = getAI();
  try {
    const res = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview", 
      contents: `Search for real-time prices for "${query}" in South Africa. Compare Takealot, Makro, Checkers, and PEP.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Retail Analyst. Use a Markdown table. Bold the best ZAR price."
      }
    });
    return res.text || "No intelligence found.";
  } catch (e) {
    return "[ERROR]: Intelligence link failure.";
  }
};

export const getBookSuggestions = async (title: string): Promise<string[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List 5 common SA textbook titles for: "${title}".`,
      config: { 
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

export const checkListingSafety = async (title: string, category: Category): Promise<{ safe: boolean; reason?: string }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Safety check for: ${title}. Return JSON {safe: bool, reason: string}.`,
      config: { 
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ['safe']
        }
      }
    });
    return JSON.parse(response.text || '{"safe": true}');
  } catch (e) {
    return { safe: true };
  }
};
