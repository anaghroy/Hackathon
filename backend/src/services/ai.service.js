import { geminiAnalyze } from "../services/ai/providers/gemini.provider.js";
import { groqAnalyze } from "../services/ai/providers/groq.provider.js";
import { huggingfaceAnalyze } from "../services/ai/providers/huggingface.provider.js";
import { openRouterAnalyze } from "../services/ai/providers/openrouter.provider.js";
import { cohereAnalyze } from "../services/ai/providers/cohere.provider.js";
import { togetherAnalyze } from "../services/ai/providers/together.provider.js";
import { deepInfraAnalyze } from "../services/ai/providers/DeepInfra.provider.js";

// CONFIG

const TIMEOUT_MS = 15000;
const MAX_PROMPT_LENGTH = 12000;
const MIN_VALID_LENGTH = 10;

// TIMEOUT WRAPPER

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
  return typeof res === "string" && res.length > MIN_VALID_LENGTH;
};

// PROMPT TRIMMER

const trimPrompt = (prompt) => {
  if (!prompt) return "";

  return prompt.length > MAX_PROMPT_LENGTH
    ? prompt.slice(-MAX_PROMPT_LENGTH)
    : prompt;
};

// SMART ROUTING LOGIC
const getSmartProviderOrder = (prompt) => {
  const p = prompt.toLowerCase();
  
  // Define provider functions map
  const providerMap = {
    Gemini: geminiAnalyze,
    Groq: groqAnalyze,
    HuggingFace: huggingfaceAnalyze,
    Cohere: cohereAnalyze,
    OpenRouter: openRouterAnalyze,
    DeepInfra: deepInfraAnalyze,
    Together: togetherAnalyze,
  };

  // Default order
  let order = ["Gemini", "Groq", "HuggingFace", "Cohere", "OpenRouter", "DeepInfra", "Together"];

  let intent = "general";

  if (p.includes("security") || p.includes("vulnerability") || p.includes("owasp")) {
    intent = "security";
    order = ["Gemini", "Groq", "OpenRouter", "Together"]; // Gemini/Groq have better reasoning for security
  } else if (p.includes("schema") || p.includes("er diagram") || p.includes("mermaid")) {
    intent = "schema";
    order = ["Gemini", "OpenRouter", "Cohere"]; // Gemini is excellent at structured output/diagrams
  } else if (p.includes("review") || p.includes("best practices")) {
    intent = "review";
    order = ["Groq", "Gemini", "Together"]; // Groq is fast for iterative reviews
  } else if (p.includes("performance") || p.includes("bottleneck") || p.includes("complexity")) {
    intent = "performance";
    order = ["Groq", "Gemini", "DeepInfra"];
  } else if (p.includes("test") || p.includes("unit test") || p.includes("coverage")) {
    intent = "testing";
    order = ["Groq", "Gemini", "Together"];
  }

  console.log(`Smart Routing: Detected intent '${intent}', prioritized: ${order[0]}`);

  return order.map(name => ({ name, fn: providerMap[name] }));
};

// MAIN ANALYZER
export const analyzeCodeWithAI = async (parsedData, options = {}) => {
  const { stream = false, onChunk = null } = options;
  
  const prompt =
    parsedData?.customPrompt ||
    `Analyze project:
Files: ${parsedData?.totalFiles || 0}
Lines: ${parsedData?.totalLines || 0}`;

  const safePrompt = trimPrompt(prompt);
  const providers = getSmartProviderOrder(safePrompt);

  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}${stream ? " (streaming)" : ""}`);

      const result = await retry(
        () => withTimeout(provider.fn(safePrompt, { stream, onChunk }), TIMEOUT_MS),
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
        console.log(`Skipping ${provider.name} (non-retryable issue)`);
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
  "issues": [
    {
      "issue": "Title of the vulnerability",
      "explanation": "Detailed description of the risk",
      "line": number,
      "filePath": "relative/path/to/file.js",
      "suggestedFix": "Corrected code block"
    }
  ]
}

If no issues, set "highRiskIssues": 0 and "issues": [].

Code:
${fileSummary}`;

    const aiResult = await analyzeCodeWithAI({
      customPrompt: prompt,
    });

    let parsed;
    try {
      const firstBrace = aiResult.indexOf("{");
      const lastBrace = aiResult.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonStr = aiResult.substring(firstBrace, lastBrace + 1);
        parsed = JSON.parse(jsonStr);
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      parsed = {
        highRiskIssues: 0,
        issues: [
          {
            issue: "Analysis Error",
            explanation:
              "The AI response could not be parsed into a structured report. Raw output: " +
              aiResult.slice(0, 200),
            line: 0,
            suggestedFix: "// Unable to generate fix",
          },
        ],
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
