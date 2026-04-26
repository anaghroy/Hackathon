import fetch from "node-fetch";
import { config } from "../../../config/config.js";

export const togetherAnalyze = async (prompt) => {
  const res = await fetch("https://api.together.xyz/v1/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      prompt,
      max_tokens: 500,
    }),
  });

  const data = await res.json();
  return data.choices[0].text;
};