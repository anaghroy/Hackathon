import fetch from "node-fetch";
import { config } from "../../../config/config.js";

export const huggingfaceAnalyze = async (prompt) => {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/bigcode/starcoder",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  const data = await res.json();
  return data[0]?.generated_text || "No response";
};