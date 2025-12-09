// services/geminiService.ts (Modified for Client-side Direct API Call)

import { GoogleGenAI, Type } from "@google/genai";
import { FlashcardData } from "../types";

// 🛑 WARNING: API Key is exposed in client-side code for Netlify deployment!
// Replace the placeholder below with your actual Gemini API Key.
// Netlify/Vercel အတွက် လုံခြုံမှုကို ထည့်မတွက်ဘဲ API Key ကို တိုက်ရိုက် ထည့်သွင်းပါ။
const API_KEY = "သင့်_Gemini_API_Key_ကို_ဒီမှာ_တိုက်ရိုက်_ကူးထည့်ပါ"; 

// API Key ကို စစ်ဆေးခြင်း
if (!API_KEY || API_KEY === "သင့်_Gemini_API_Key_ကို_ဒီမှာ_တိုက်ရိုက်_ကူးထည့်ပါ") {
  throw new Error("API Key is missing or incorrectly set in services/geminiService.ts.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateFlashcards = async (topic: string, difficulty: string): Promise<FlashcardData[]> => {
    // Note: Prompt logic is moved back to the client-side
    const prompt = `
        Generate 20 high-quality, professional vocabulary words or phrases for learning Burmese and Chinese simultaneously.
        Topic: ${topic}
        Difficulty: ${difficulty}
        
        The content should be suitable for professional or serious learners.
        For each item, provide:
        1. The English meaning.
        2. The Burmese script (ensure correct spelling).
        3. The Burmese pronunciation (phonetic/romanized standard).
        4. The Simplified Chinese characters.
        5. The Chinese Pinyin (with tone marks).
        
        Ensure the Burmese and Chinese translations are accurate, contextually appropriate, and natural.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are an expert linguistics professor and language tutor specializing in Burmese and Chinese. Provide accurate, professional-grade educational content.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            english: { type: Type.STRING, description: "English meaning" },
                            burmese: { type: Type.STRING, description: "Burmese script" },
                            burmesePronunciation: { type: Type.STRING, description: "Burmese romanized pronunciation" },
                            chinese: { type: Type.STRING, description: "Chinese Simplified characters" },
                            chinesePinyin: { type: Type.STRING, description: "Chinese Pinyin with tone marks" },
                            category: { type: Type.STRING, description: "The specific sub-category (e.g., Noun, Verb, Idiom)" }
                        },
                        required: ["english", "burmese", "burmesePronunciation", "chinese", "chinesePinyin", "category"]
                    }
                }
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("No data received from Gemini.");
        }
        
        const parsed = JSON.parse(text);
        
        if (!Array.isArray(parsed)) {
            throw new Error("Invalid data format received from AI");
        }

        // Filtering is omitted for simplicity in this exposed key method
        return parsed as FlashcardData[];
        
    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw error;
    }
};