import { analyzeCodeWithAI } from "./ai.service.js";

export const scanCodeForVulnerabilities = async (code, contextData) => {
  const prompt = `
You are an expert DevSecOps Agent and Security Researcher.
Your task is to analyze the following code snippet for any security vulnerabilities (e.g., SQL Injection, XSS, Insecure API Endpoints, OWASP Top 10).

Context provided (Project files or dependencies if any):
${contextData || "No additional context"}

Code to analyze:
\`\`\`
${code}
\`\`\`

If vulnerabilities are found, return a JSON array where each object has:
- "issue": The name of the vulnerability.
- "line": The approximate line number or code snippet where it occurs.
- "explanation": A "Why is this dangerous?" explanation in plain English.
- "suggestedFix": The exact rewritten code that fixes the vulnerability.

If no vulnerabilities are found, return an empty array [].
Do not include any markdown wrapping for the JSON (like \\\`\\\`\\\`json), just return the raw JSON array string.
`;
  
  const rawResult = await analyzeCodeWithAI({ customPrompt: prompt });
  
  // Clean up markdown wrapping if AI still returns it
  let cleanedString = rawResult;
  if (typeof rawResult === 'string') {
    cleanedString = rawResult.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();
  }
  
  try {
    return JSON.parse(cleanedString);
  } catch (error) {
    // Fallback if parsing fails
    return [{
      issue: "Parsing Error",
      line: "N/A",
      explanation: "Failed to parse AI response into JSON format.",
      suggestedFix: rawResult
    }];
  }
};
