import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../../config/config.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

export const geminiAnalyze = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
};