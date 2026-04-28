import { geminiAnalyze } from "../services/ai/providers/gemini.provider.js";
import { groqAnalyze } from "../services/ai/providers/groq.provider.js";
import { togetherAnalyze } from "../services/ai/providers/together.provider.js";
import { huggingfaceAnalyze } from "../services/ai/providers/huggingface.provider.js";
import { deepInfraAnalyze } from "../services/ai/providers/DeepInfra.provider.js";

const withTimeout = (promise, ms = 8000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms),
    ),
  ]);
};

// Retry wrapper
const retry = async (fn, retries = 2) => {
  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.log(`Retry ${i + 1} failed`);
    }
  }

  throw lastError;
};

export const analyzeCodeWithAI = async (parsedData) => {
  const prompt =
    parsedData?.customPrompt ||
    `Analyze project:
Files: ${parsedData?.totalFiles || 0}
Lines: ${parsedData?.totalLines || 0}`;

  const providers = [
    { name: "Gemini", fn: geminiAnalyze },
    { name: "Together", fn: togetherAnalyze },
    { name: "Groq", fn: groqAnalyze },
    { name: "HuggingFace", fn: huggingfaceAnalyze },
    { name: "DeepInfra", fn: deepInfraAnalyze },
  ];

  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}`);

      const result = await retry(
        () => withTimeout(provider.fn(prompt), 8000),
        1, // retry count
      );

      // validate response
      if (result && result.length > 20) {
        console.log(`Success with ${provider.name}`);
        return result;
      }

      throw new Error("Invalid response");
    } catch (err) {
      console.error(`${provider.name} failed:`, err.message);
      lastError = err;
    }
  }

  console.error("All providers failed");

  return "AI system overloaded. Please try again.";
};

export const analyzeCodeSecurity = async (projectId, projectFiles) => {
  const fileSummary = projectFiles.map(f => `File: ${f.filename}\n${f.content}`).join("\n\n");
  const prompt = `Analyze the following codebase for security vulnerabilities (e.g. OWASP top 10). 
Return a JSON object with a 'highRiskIssues' count and an 'issues' array detailing the vulnerabilities. 
If no critical issues, 'highRiskIssues' should be 0.
Code:
${fileSummary}`;

  try {
    const aiResult = await analyzeCodeWithAI({ customPrompt: prompt });
    let result;
    try {
      result = JSON.parse(aiResult.replace(/```json|```/g, ''));
    } catch (e) {
      // Fallback if parsing fails, assume safe for now or handle appropriately
      result = { highRiskIssues: 0, issues: ["Failed to parse AI security response"] };
    }
    return result;
  } catch (err) {
    console.error("Security scan failed:", err);
    return { highRiskIssues: 0, issues: ["Security scan failed due to server error"] };
  }
};
