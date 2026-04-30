import { CohereClient } from "cohere-ai";
import { config } from "../../../config/config.js";

const cohere = new CohereClient({
  token: config.COHERE_API_KEY,
});

export const cohereAnalyze = async (prompt) => {
  const res = await cohere.chat({
    model: "command",
    message: prompt,
    temperature: 0.3,
    maxTokens: 1200,
  });

  return res.text;
};