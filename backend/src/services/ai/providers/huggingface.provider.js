import fetch from "node-fetch";
import { config } from "../../../config/config.js";

export const huggingfaceAnalyze = async (prompt) => {
  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true, // auto-waits if model is loading
          },
        }),
      }
    );

    // Handle non-JSON responses safely
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error(`Invalid JSON response: ${text.slice(0, 100)}`);
    }

    // Handle API errors
    if (!res.ok) {
      throw new Error(data.error || "HuggingFace API error");
    }

    return data?.[0]?.generated_text || "No response";
  } catch (error) {
    console.error("HuggingFace failed:", error.message);
    throw error;
  }
};