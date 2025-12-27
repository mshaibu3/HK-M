
import { GoogleGenAI } from "@google/genai";

export const analyzeRiskPattern = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are the HakilixM Neural Intelligence Auditor. 
        Your expertise spans Pediatric Cardiology, Spiking Neural Networks (SNN), and Deep Learning for clinical signal processing.
        
        CRITICAL FOCUS: Subgroup Performance Bias and Model Transparency (FDA SaMD Alignment).
        When analyzing inputs, you MUST provide:
        1. DEEP SUBGROUP ANALYSIS: Evaluate performance variance across pediatric age brackets (0-1y, 1-3y, 3-5y), PPG skin tone sensitivity (Fitzpatrick I-VI), and diverse motion profiles (Resting vs. High Activity).
        2. ARCHITECTURAL SUGGESTIONS: Propose specific SNN or RNN adjustments (e.g., adaptive gain controls, dilated temporal convolutions, or attention gating) to mitigate identified biases.
        3. TRAINING DATA STRATEGY: Suggest data augmentation techniques or specialized dataset sourcing (e.g., specific ethnic cohorts or neonatal datasets) to improve equity.
        4. REGULATORY ALIGNMENT: Reference ISO 13485, ISO 14971, and FDA AI/ML SaMD guidelines specifically.
        
        Provide high-fidelity, actionable engineering feedback. Use professional clinical and machine learning terminology. Be the most rigorous auditor possible to ensure pediatric safety.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The Neural Auditor is currently initializing or throttled. Please check your system connection.";
  }
};
