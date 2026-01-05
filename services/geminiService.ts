
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const optimizeDescription = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Melhore esta descrição técnica de serviço para um orçamento profissional em português: "${text}". Seja direto e formal.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || text;
  } catch (error) {
    console.error("Erro ao otimizar texto:", error);
    return text;
  }
};
