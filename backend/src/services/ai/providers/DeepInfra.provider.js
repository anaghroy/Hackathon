import axios from "axios";
import { config } from "../../../config/config.js";

const deepinfra = axios.create({
  baseURL: "https://api.deepinfra.com/v1/openai",
  headers: {
    Authorization: `Bearer ${config.DEEPINFRA_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const deepInfraAnalyze = async (prompt) => {
  const res = await deepinfra.post("/chat/completions", {
    model: "meta-llama/Meta-Llama-3-70B-Instruct",
    messages: [{ role: "user", content: prompt }],
  });

  return res.data.choices[0].message.content;
};