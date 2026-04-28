import fetch from "node-fetch";
import { config } from "../../../config/config.js";

export const togetherAnalyze = async (prompt) => {
  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/Llama-3-70b-chat-hf",

      messages: [
        { role: "system", content: "You are a senior software engineer." },
        { role: "user", content: prompt },
      ],

      max_tokens: 800,
      temperature: 0.3,
    }),
  });

  // handle API error properly
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Together API error: ${errText}`);
  }

  const data = await res.json();

  // SAFE PARSE
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    console.error("Together raw response:", data);
    throw new Error("Invalid Together response");
  }

  return text.trim();
};
