import Project from "../models/project.model.js";
import { parseProjectFiles } from "../services/parser.service.js";
import { analyzeCodeWithAI } from "../services/ai.service.js";
import { generateGraph } from "../services/graph.service.js";
import { scanCodeForVulnerabilities } from "../services/security.service.js";
import { analyzeStackTrace } from "../services/debugger.service.js";
import DecisionMemory from "../models/decisionMemory.model.js";
import AIAnalysis from "../models/aiAnalysis.model.js";
import {
  setCache,
  getCache,
  buildExplainKey,
} from "../services/cache.service.js";

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
      console.log("DB hit");

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
`,
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

export const reviewCode = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { code, filePath } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Code snippet is required for review." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch memory/conventions
    const memories = await DecisionMemory.find({ projectId }).limit(20);

    const memoryText = memories
      .map(
        (m, i) => `
Decision ${i + 1}:
File Context: ${m.filePath}
Title: ${m.title || "N/A"}
Reasoning: ${m.description}
Tags: ${(m.tags || []).join(", ")}
`,
      )
      .join("\n");

    const prompt = `
You are an expert Senior Software Engineer and Code Reviewer.
Your task is to review the following code snippet submitted for a Pull Request or Code Commit.

You MUST enforce the team conventions and past architectural decisions listed below. If the new code violates any of these decisions, point it out clearly and provide a corrected version.

Team Decisions & Conventions:
\${memoryText || "No previous decisions recorded. Review based on general best practices."}

Code to Review \${filePath ? \`(File: \${filePath})\` : ""}:
\\\`\\\`\\\`
\${code}
\\\`\\\`\\\`

Format your response in clear sections:
1. Review Summary (Is it good to go or needs changes?)
2. Convention Checks (Does it align with the Team Decisions?)
3. Potential Issues & Bugs
4. Refactored Code (If changes are suggested)
`;

    const reviewResult = await analyzeCodeWithAI({ customPrompt: prompt });

    res.json({
      review: reviewResult,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateTests = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { code, intent, framework = "Jest" } = req.body;

    if (!code && !intent) {
      return res
        .status(400)
        .json({
          message:
            "Code snippet or intent description is required to generate tests.",
        });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const prompt = `
You are an expert QA Engineer and SDET.
Your task is to generate a comprehensive unit testing suite for the following code or intent using the \${framework} framework.

\${code ? \`CODE TO TEST:\\n\\\`\\\`\\\`\\n\${code}\\n\\\`\\\`\\\`\` : ""}
\${intent ? \`INTENT / FUNCTIONALITY DESCRIPTION:\\n\${intent}\` : ""}

Please generate exhaustive unit tests including:
1. Positive cases (happy path)
2. Negative cases (invalid inputs, errors)
3. Edge cases

Return ONLY the test code in a code block. Do not include extraneous explanations outside the code block, but use comments inside the code block to explain the test cases.
`;

    const testResult = await analyzeCodeWithAI({ customPrompt: prompt });

    res.json({
      tests: testResult,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateSchema = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { prompt: userPrompt, orm = "Mongoose" } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ message: "Natural language prompt is required." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const aiPrompt = `
You are an expert Database Architect.
The user wants to generate a database schema based on the following description:
"\${userPrompt}"

Please generate the following:
1. The code for the database models/schemas using the \${orm} ORM/framework.
2. A Mermaid.js Entity-Relationship (ER) diagram string to visually represent the relationships.

You MUST format your entire response as a valid JSON object with the following structure. Do NOT wrap the JSON in markdown code blocks (\\\`\\\`\\\`json ... \\\`\\\`\\\`), just return the raw JSON object.

{
  "code": "// Your generated \${orm} models code here as a single string",
  "mermaid": "erDiagram\\n  // Your generated Mermaid ER diagram here"
}
`;

    const rawResult = await analyzeCodeWithAI({ customPrompt: aiPrompt });
    
    // Parse the JSON string
    let resultJson;
    try {
      // In case the AI still wraps it in markdown blocks, strip them
      const cleanedString = rawResult.replace(/^\\\`\\\`\\\`json/i, "").replace(/^\\\`\\\`\\\`/i, "").replace(/\\\`\\\`\\\`$/i, "").trim();
      resultJson = JSON.parse(cleanedString);
    } catch (e) {
      // Fallback if parsing fails
      resultJson = {
        code: rawResult,
        mermaid: "erDiagram\\n  ERROR_PARSING {\\n    string message\\n  }"
      };
    }

    res.json(resultJson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const debugCode = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { stackTrace, errorMessage } = req.body;

    if (!stackTrace) {
      return res.status(400).json({ message: "Stack trace is required for debugging." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const explanation = await analyzeStackTrace(project, stackTrace, errorMessage);

    res.json({
      explanation,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const securityScan = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code snippet is required for security scan." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Context can be file names to save token space
    const contextData = project.files.map(f => f.filename).join(", ");

    const vulnerabilities = await scanCodeForVulnerabilities(code, contextData);

    res.json({
      vulnerabilities,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
