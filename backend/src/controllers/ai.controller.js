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

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // STEP 1: Parse files
    const parsedData = parseProjectFiles(project.files);

    // STEP 2: Send to AI
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

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const graph = generateGraph(project.files);

    res.json(graph);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const explainGraphWithAI = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const cacheKey = buildExplainKey(projectId);

    // STEP 1: REDIS CACHE
    const cached = await getCache(cacheKey);

    if (cached) {
      console.log(" Redis cache hit");

      return res.json({
        ...cached,
        cached: true,
        source: "redis",
      });
    }

    // STEP 2: DB CHECK
    const existing = await AIAnalysis.findOne({ projectId }).sort({
      createdAt: -1,
    });

    if (existing) {
      console.log("💾 DB hit");

      const data = {
        graph: existing.graph,
        explanation: existing.explanation,
      };

      // save to redis
      await setCache(cacheKey, data, 300);

      return res.json({
        ...data,
        cached: true,
        source: "db",
      });
    }

    // STEP 3: GENERATE GRAPH
    const graph = generateGraph(project.files);

    // STEP 4: FETCH MEMORY
    const memories = await DecisionMemory.find({ projectId }).limit(5);

    const memoryText = memories
      .map(
        (m, i) => `
Decision ${i + 1}:
File: ${m.filePath}
Title: ${m.title || "N/A"}
Reason: ${m.description}
Tags: ${(m.tags || []).join(", ")}
`
      )
      .join("\n");

    // STEP 5: PROMPT
    const prompt = `
You are a senior software engineer.

You MUST use the project decision memories below while explaining.

Project Decision Memories:
${memoryText || "No previous decisions recorded."}

FILES:
${graph.nodes.map((n) => n.id).join("\n")}

DEPENDENCIES:
${
  graph.edges.length
    ? graph.edges.map((e) => `${e.source} imports ${e.target}`).join("\n")
    : "No dependencies found"
}

Format your response in clear sections:
1. File Responsibilities
2. File Connections
3. Data Flow
4. Decisions
5. Improvements
`;

    // STEP 6: AI CALL
    const explanation = await analyzeCodeWithAI({
      customPrompt: prompt,
      totalFiles: graph.nodes.length,
    });

    const data = { graph, explanation };

    // STEP 7: SAVE DB
    await AIAnalysis.create({
      projectId,
      graph,
      explanation,
    });

    // STEP 8: SAVE REDIS
    await setCache(cacheKey, data, 300);

    // RESPONSE
    res.json({
      ...data,
      cached: false,
      source: "ai",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
