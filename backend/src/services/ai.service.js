import { geminiAnalyze } from "../services/ai/providers/gemini.provider.js";
import { groqAnalyze } from "../services/ai/providers/groq.provider.js";
import { togetherAnalyze } from "../services/ai/providers/together.provider.js";
import { huggingfaceAnalyze } from "../services/ai/providers/huggingface.provider.js";

export const analyzeCodeWithAI = async (parsedData) => {
  try {
    // Handle custom prompt OR default prompt
    const prompt =
      parsedData?.customPrompt ||
      `
Analyze project:

Total Files: ${parsedData?.totalFiles || 0}
Total Lines: ${parsedData?.totalLines || 0}

File Types:
${JSON.stringify(parsedData?.fileTypes || {})}
`;

    // SMART ROUTING
    if (parsedData?.totalFiles < 5) {
      console.log("Using Gemini");
      return await geminiAnalyze(prompt);
    }

    if (parsedData?.totalFiles < 15) {
      console.log("Using Together");
      return await togetherAnalyze(prompt);
    }

    if (parsedData?.totalFiles < 40) {
      console.log("Using Groq");
      return await groqAnalyze(prompt);
    }

    console.log("Using HuggingFace");
    return await huggingfaceAnalyze(prompt);
  } catch (err) {
    console.error("AI Service Error:", err);
    return "All AI providers failed";
  }
};