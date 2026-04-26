import { geminiAnalyze } from "../services/ai/providers/gemini.provider.js";
import { groqAnalyze } from "../services/ai/providers/groq.provider.js";
import { togetherAnalyze } from "../services/ai/providers/together.provider.js";
import { huggingfaceAnalyze } from "../services/ai/providers/huggingface.provider.js";

export const analyzeCodeWithAI = async (parsedData) => {
  const prompt =
    parsedData?.customPrompt ||
    `
Analyze project:

Total Files: ${parsedData?.totalFiles || 0}
Total Lines: ${parsedData?.totalLines || 0}

File Types:
${JSON.stringify(parsedData?.fileTypes || {})}
`;

  // Provider list (priority order)
  const providers = [
    { name: "Gemini", fn: geminiAnalyze },
    { name: "Together", fn: togetherAnalyze },
    { name: "Groq", fn: groqAnalyze },
    { name: "HuggingFace", fn: huggingfaceAnalyze },
  ];

  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}...`);

      const result = await provider.fn(prompt);

      if (result) {
        console.log(`Success with ${provider.name}`);
        return result;
      }
    } catch (err) {
      console.error(`${provider.name} failed:`, err.message);
      lastError = err;
    }
  }

  console.error("All AI providers failed:", lastError);

  return "AI is currently overloaded. Please try again later.";
};
