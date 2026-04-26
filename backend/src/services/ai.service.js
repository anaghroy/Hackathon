import { geminiAnalyze } from "../services/ai/providers/gemini.provider.js";
import { groqAnalyze } from "../services/ai/providers/groq.provider.js";
import { togetherAnalyze } from "../services/ai/providers/together.provider.js";
import { huggingfaceAnalyze } from "../services/ai/providers/huggingface.provider.js";

export const analyzeCodeWithAI = async (parsedData) => {
  const prompt = `
Analyze this project:

Files: ${parsedData.totalFiles}
Lines: ${parsedData.totalLines}
Types: ${JSON.stringify(parsedData.fileTypes)}
`;

  try {
    // SMART ROUTING
    if (parsedData.totalFiles < 5) {
      console.log("Using Gemini");
      return await geminiAnalyze(prompt);
    }

    if (parsedData.totalFiles < 15) {
      console.log("Using Together");
      return await togetherAnalyze(prompt);
    }

    if (parsedData.totalFiles < 40) {
      console.log("Using Groq");
      return await groqAnalyze(prompt);
    }

    console.log("Using HuggingFace");
    return await huggingfaceAnalyze(prompt);
  } catch (err) {
    return "All AI providers failed";
  }
};
