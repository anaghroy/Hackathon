import { geminiAnalyze } from "../services/ai/providers/gemini.provider.js";
import { groqAnalyze } from "../services/ai/providers/groq.provider.js";
import { huggingfaceAnalyze } from "../services/ai/providers/huggingface.provider.js";
import { openRouterAnalyze } from "../services/ai/providers/openrouter.provider.js";
import { cohereAnalyze } from "../services/ai/providers/cohere.provider.js";
import { togetherAnalyze } from "../services/ai/providers/together.provider.js";
import { deepInfraAnalyze } from "../services/ai/providers/DeepInfra.provider.js";

// -----------------------------
// CONFIG
// -----------------------------
const TIMEOUT_MS = 15000;
const MAX_PROMPT_LENGTH = 12000;
const MIN_VALID_LENGTH = 50;

// -----------------------------
// TIMEOUT WRAPPER
// -----------------------------
const withTimeout = (promise, ms = TIMEOUT_MS) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);
};

// ERROR CLASSIFICATION

const isRetryable = (err) => {
  const msg = err.message?.toLowerCase() || "";

  return (
    msg.includes("timeout") ||
    msg.includes("econnreset") ||
    msg.includes("503") ||
    msg.includes("loading")
  );
};

const shouldSkipProvider = (err) => {
  const msg = err.message?.toLowerCase() || "";

  return (
    msg.includes("402") || // no credits
    msg.includes("quota") ||
    msg.includes("not found") ||
    msg.includes("invalid model") ||
    msg.includes("401")
  );
};

// RETRY LOGIC

const retry = async (fn, retries = 1) => {
  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (!isRetryable(err)) {
        throw err; // don't retry useless errors
      }

      console.log(`Retry ${i + 1} (retryable error)`);
    }
  }

  throw lastError;
};

// RESPONSE VALIDATION

const isValidResponse = (res) => {
  return (
    typeof res === "string" &&
    res.length > MIN_VALID_LENGTH &&
    !res.toLowerCase().includes("error") &&
    !res.toLowerCase().includes("failed")
  );
};

// PROMPT TRIMMER

const trimPrompt = (prompt) => {
  if (!prompt) return "";

  return prompt.length > MAX_PROMPT_LENGTH
    ? prompt.slice(-MAX_PROMPT_LENGTH)
    : prompt;
};

// MAIN ANALYZER

export const analyzeCodeWithAI = async (parsedData) => {
  const prompt =
    parsedData?.customPrompt ||
    `Analyze project:
Files: ${parsedData?.totalFiles || 0}
Lines: ${parsedData?.totalLines || 0}`;

  const safePrompt = trimPrompt(prompt);

  // CLEAN provider order
  const providers = [
    { name: "Groq", fn: groqAnalyze },
    { name: "OpenRouter", fn: openRouterAnalyze },
    { name: "Gemini", fn: geminiAnalyze },
    { name: "HuggingFace", fn: huggingfaceAnalyze },
    { name: "Cohere", fn: cohereAnalyze },
    { name: "DeepInfra", fn: deepInfraAnalyze },
    { name: "Together", fn: togetherAnalyze },
  ];

  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}`);

      const result = await retry(
        () => withTimeout(provider.fn(safePrompt), TIMEOUT_MS),
        1,
      );

      if (isValidResponse(result)) {
        console.log(`Success with ${provider.name}`);
        return result;
      }

      throw new Error("Invalid response");
    } catch (err) {
      const msg = err.message || "";

      if (shouldSkipProvider(err)) {
        console.log(`⏭Skipping ${provider.name} (non-retryable issue)`);
        continue;
      }

      console.error(`${provider.name} failed:`, msg);
      lastError = err;
    }
  }

  console.error("All providers failed");

  return "AI system overloaded. Please try again.";
};

// SECURITY ANALYSIS

export const analyzeCodeSecurity = async (projectId, projectFiles) => {
  try {
    const MAX_FILES = 5;
    const MAX_FILE_CHARS = 2000;

    const fileSummary = projectFiles
      .slice(0, MAX_FILES)
      .map(
        (f) =>
          `File: ${f.filename}\n${(f.content || "").slice(0, MAX_FILE_CHARS)}`,
      )
      .join("\n\n");

    const prompt = `Analyze the following codebase for security vulnerabilities (OWASP Top 10).

Return STRICT JSON:
{
  "highRiskIssues": number,
  "issues": string[]
}

If no critical issues, set "highRiskIssues": 0.

Code:
${fileSummary}`;

    const aiResult = await analyzeCodeWithAI({
      customPrompt: prompt,
    });

    let parsed;

    try {
      parsed = JSON.parse(aiResult.replace(/```json|```/g, ""));
    } catch {
      parsed = {
        highRiskIssues: 0,
        issues: ["Failed to parse AI response"],
      };
    }

    return parsed;
  } catch (err) {
    console.error("Security scan failed:", err);

    return {
      highRiskIssues: 0,
      issues: ["Security scan failed due to server error"],
    };
  }
};
