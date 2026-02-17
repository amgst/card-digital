
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY as string | undefined;
let ai: GoogleGenAI | null = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBio = async (name: string, title: string, company: string, keywords: string): Promise<string> => {
  try {
    if (!apiKey || !ai) {
      return "Write a short professional bio about yourself here.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional, catchy, and concise bio (max 150 characters) for a digital business card. 
      Name: ${name}
      Job Title: ${title}
      Company: ${company}
      Additional Info: ${keywords}`,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    // Access the generated text directly from the response object's text property.
    return response.text.trim() || "Bio generation failed. Please try again.";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Error generating bio. Please check your connection or try later.";
  }
};
