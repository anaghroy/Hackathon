import Groq from "groq-sdk";
import { config } from "../../../config/config.js";

const groq = new Groq({
  apiKey: config.GROQ_API_KEY,
});

export const groqAnalyze = async (prompt) => {
  const res = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content;
};