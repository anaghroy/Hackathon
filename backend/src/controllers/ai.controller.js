import Project from "../models/project.model.js";
import { parseProjectFiles } from "../services/parser.service.js";
import { analyzeCodeWithAI } from "../services/ai.service.js";
import { generateGraph } from "../services/graph.service.js";
import DecisionMemory from "../models/decisionMemory.model.js";
import AIAnalysis from "../models/aiAnalysis.model.js";
import { setCache, getCache, buildExplainKey } from "../services/cache.service.js";

export const intentAnalysis = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const parsedData = parseProjectFiles(project.files);
    const aiResult = await analyzeCodeWithAI(parsedData);

    res.json({
      summary: parsedData,
      aiAnalysis: aiResult,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const explainCodebase = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const graph = generateGraph(project.files);
    res.json(graph);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const explainGraphWithAI = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const cacheKey = buildExplainKey(projectId);
    const cached = await getCache(cacheKey);

    if (cached) {
      return res.json({ ...cached, cached: true, source: "redis" });
    }

    const existing = await AIAnalysis.findOne({ projectId }).sort({ createdAt: -1 });
    if (existing) {
      const data = { graph: existing.graph, explanation: existing.explanation };
      await setCache(cacheKey, data, 300);
      return res.json({ ...data, cached: true, source: "db" });
    }

    const graph = generateGraph(project.files);
    const memories = await DecisionMemory.find({ projectId }).limit(5);

    const memoryText = memories
      .map((m, i) => `Decision ${i + 1}: File: ${m.filePath}, Title: ${m.title || "N/A"}, Reason: ${m.description}`)
      .join("\n");

    const prompt = `
You are a senior software engineer explaining a codebase.
Use the following project decisions for context:
${memoryText || "No previous decisions recorded."}

FILES: ${graph.nodes.map((n) => n.id).join(", ")}
Format your response in sections: Responsibilities, Connections, Data Flow, Decisions, Improvements.
`;

    const explanation = await analyzeCodeWithAI({
      customPrompt: prompt,
      totalFiles: graph.nodes.length,
    });

    const data = { graph, explanation };
    await AIAnalysis.create({ projectId, graph, explanation });
    await setCache(cacheKey, data, 300);

    res.json({ ...data, cached: false, source: "ai" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateSchema = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { prompt } = req.body;

    const aiPrompt = `Generate a Database Schema based on: "${prompt}". Provide Mongoose/Prisma code and a Mermaid ER diagram string. Format as JSON: { "code": "...", "mermaid": "erDiagram ..." }.`;
    const aiResult = await analyzeCodeWithAI({ customPrompt: aiPrompt });
    
    let result;
    try {
      result = JSON.parse(aiResult.replace(/```json|```/g, ''));
    } catch (e) {
      result = { code: aiResult, mermaid: "erDiagram\n    ERROR[Error parsing mermaid]" };
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateTests = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { code, intent } = req.body;

    const aiPrompt = `Generate unit tests for: \`\`\`\n${code}\n\`\`\`\nIntent: ${intent || "Comprehensive coverage"}. Provide only code.`;
    const aiResult = await analyzeCodeWithAI({ customPrompt: aiPrompt });
    res.json({ code: aiResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reviewCode = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { code } = req.body;

    const aiPrompt = `Review this code: \`\`\`\n${code}\n\`\`\`. Return JSON with keys: issues, suggestions, bestPractices, conventionMismatches.`;
    const aiResult = await analyzeCodeWithAI({ customPrompt: aiPrompt });
    
    let result;
    try {
      result = JSON.parse(aiResult.replace(/```json|```/g, ''));
    } catch (e) {
      result = { issues: ["Error parsing AI review"], suggestions: [aiResult], bestPractices: [], conventionMismatches: [] };
    }
    res.json({ review: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
