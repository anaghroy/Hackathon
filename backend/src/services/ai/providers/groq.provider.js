import Groq from "groq-sdk";
import { config } from "../../../config/config.js";

const groq = new Groq({
  apiKey: config.GROQ_API_KEY,
});

export const groqAnalyze = async (prompt, options = {}) => {
  const { stream = false, onChunk } = options;

  if (stream && onChunk) {
    const streamRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    let fullText = "";
    for await (const chunk of streamRes) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullText += content;
        onChunk(content);
      }
    }
    return fullText;
  }

  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content;
};