import { analyzeCodeWithAI } from "./ai.service.js";
import { generateGraph } from "./graph.service.js";

export const analyzeStackTrace = async (project, stackTrace, errorMessage) => {
  const graph = generateGraph(project.files);
  const allFiles = project.files;
  
  // Extract potential file names from the stack trace
  const relevantFiles = [];
  
  allFiles.forEach(file => {
    // If the file's name or path is mentioned in the stack trace, consider it relevant
    const baseName = file.filename.split('/').pop();
    if (stackTrace.includes(file.filename) || stackTrace.includes(baseName)) {
      relevantFiles.push(file);
    }
  });

  // Include relevant files, or default to some files if none matched explicitly
  const filesToInclude = relevantFiles.length > 0 ? relevantFiles.slice(0, 10) : allFiles.slice(0, 10);

  const fileContentsStr = filesToInclude.map(f => `--- File: ${f.filename} ---\n${f.content}\n`).join("\n");

  const prompt = `
You are an expert Senior Software Engineer and Debugger.
Your task is to analyze the following error and stack trace using the provided project files and dependency graph.
Explain the exact sequence of events that led to the crash, pinpoint the root cause, and suggest a specific fix.

ERROR MESSAGE:
${errorMessage || "N/A"}

STACK TRACE:
${stackTrace}

RELEVANT PROJECT FILES:
${fileContentsStr}

PROJECT DEPENDENCY GRAPH (Edges):
${graph.edges.length ? graph.edges.map(e => `${e.source} imports ${e.target}`).join("\n") : "No dependencies found"}

Format your response in clear sections:
1. Root Cause Analysis (Explain in plain English what went wrong and why)
2. Sequence of Events (Trace backward from the crash)
3. Suggested Fix (Provide the exact code changes needed)
`;

  const result = await analyzeCodeWithAI({ customPrompt: prompt });
  return result;
};
