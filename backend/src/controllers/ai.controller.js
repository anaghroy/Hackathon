import Project from "../models/project.model.js";
import { parseProjectFiles } from "../services/parser.service.js";
import { analyzeCodeWithAI } from "../services/ai.service.js";
import { generateGraph } from "../services/graph.service.js";

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

    // Generate Graph
    const graph = generateGraph(project.files);

    // Build AI Prompt
    const prompt = `
You are a senior software engineer.

Explain this codebase in simple terms:

FILES:
${graph.nodes.map((n) => n.id).join("\n")}

DEPENDENCIES:
${
  graph.edges.length
    ? graph.edges.map((e) => `${e.source} imports ${e.target}`).join("\n")
    : "No dependencies found"
}

Explain:
1. What each file does
2. How files are connected
3. Data flow between files
4. Suggestions for improvement
`;

    // Call AI
    const explanation = await analyzeCodeWithAI({
      customPrompt: prompt,
      totalFiles: graph.nodes.length,
    });

    // Response
    res.json({
      graph,
      explanation,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
