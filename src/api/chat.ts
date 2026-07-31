import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getChatResponse(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.includes("AQ.Ab8RN6")) {
    throw new Error(
      "Invalid Gemini API Key! Please get a valid key starting with AIzaSy from Google AI Studio."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-2.5-flash for faster and supported responses
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemPrompt = `
    You are KrishiMitra AI, an expert agricultural advisory assistant for Indian farmers.
    Respond in clear, helpful language (supporting Telugu, English, and Hindi where appropriate).
    Keep advice practical, safe, and actionable for crops, soil, pests, fertilizers, and government agricultural schemes.
    
    User question: ${prompt}
  `;

  const result = await model.generateContent(systemPrompt);
  const response = await result.response;
  return response.text();
}