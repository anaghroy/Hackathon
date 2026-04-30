import fetch from "node-fetch";
import { config } from "../../../config/config.js";

const MODELS = [
  "deepseek/deepseek-chat",
  "meta-llama/llama-3.1-8b-instruct",
  "mistralai/mistral-7b-instruct",
  "x-ai/grok-3-mini:free",
];

export const openRouterAnalyze = async (prompt) => {
  let lastError;

  for (const model of MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "You are a senior software engineer." },
            { role: "user", content: prompt },
          ],
          max_tokens: 800,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;

      if (!text) throw new Error("Empty response");

      console.log("Success OpenRouter:", model);
      return text;
    } catch (err) {
      console.log(`Failed model: ${model}`);
      lastError = err;
    }
  }

  throw new Error("OpenRouter all models failed: " + lastError?.message);
};
