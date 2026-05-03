import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../../config/config.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

export const geminiAnalyze = async (prompt, options = {}) => {
  const { stream = false, onChunk } = options;
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
  });

  if (stream && onChunk) {
    const result = await model.generateContentStream(prompt);
    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk(chunkText);
    }
    return fullText;
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
};