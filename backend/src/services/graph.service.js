export const generateGraph = (files) => {
  try {
    let nodes = [];
    let edges = [];

    if (!files || !Array.isArray(files)) {
      return { nodes: [], edges: [] };
    }

    // Filter out invalid file entries and normalize paths
    const validFiles = files.filter(f => f && f.filename);
    const filePaths = validFiles.map((f) => f.filename.replace(/\\/g, "/"));
    const pathSet = new Set(filePaths);

    if (validFiles.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Helper to get node type based on path and filename
    const getNodeType = (path) => {
      if (!path) return "file";
      const p = path.toLowerCase();
      const parts = path.split("/");
      const filename = parts[parts.length - 1]?.toLowerCase() || "";
      
      // Order matters: more specific first
      if (p.includes("/pages/")) return "page";
      if (p.includes("/components/")) return "component";
      if (p.includes("/hooks/")) return "hook";
      if (p.includes("/utils/")) return "util";
      if (p.includes("/controllers/")) return "controller";
      if (p.includes("/routes/") || p.includes("/api/")) return "api";
      if (p.includes("/models/") || p.includes("/schemas/")) return "database";
      if (p.includes("/middleware/")) return "middleware";
      if (p.includes("/services/")) return "service";
      
      // Root / Config
      if (filename === "package.json") return "config";
      if (filename === "dockerfile" || filename.includes("docker-compose")) return "config";
      if (filename.startsWith(".env") || filename.includes("config") || filename.includes("setup")) return "config";
      
      return "file";
    };

    // Add folders
    const folders = new Set();
    filePaths.forEach((path) => {
      if (!path) return;
      const parts = path.split("/");
      let current = "";
      for (let i = 0; i < parts.length - 1; i++) {
        current += (current ? "/" : "") + parts[i];
        if (current) folders.add(current);
      }
    });

    folders.forEach((folder) => {
      const parts = folder.split("/");
      nodes.push({
        id: folder,
        type: "folder",
        data: { 
          label: parts[parts.length - 1] || folder, 
          path: folder, 
          isFolder: true 
        },
        position: { x: 0, y: 0 },
      });
    });

    // Add files
    validFiles.forEach((file) => {
      const path = file.filename.replace(/\\/g, "/");
      const type = getNodeType(path);
      const parts = path.split("/");
      
      nodes.push({
        id: path,
        type: type,
        data: { 
          label: parts[parts.length - 1] || path, 
          path: path, 
          isFolder: false,
          size: file.content?.length || 0
        },
        position: { x: 0, y: 0 },
      });

      // Parent-child edges (Folder -> File/Subfolder)
      if (parts.length > 1) {
        const parent = parts.slice(0, -1).join("/");
        if (parent) {
          edges.push({
            id: `e-${parent}-${path}`,
            source: parent,
            target: path,
            type: "smoothstep",
            style: { stroke: "rgba(255,255,255,0.05)" }
          });
        }
      }

      // Logical Connections (Imports/Requires)
      if (file.content) {
        const importRegex = /import\s+.*?from\s+['"](.*?)['"]|require\(['"](.*?)['"]\)|import\(['"](.*?)['"]\)/g;
        let match;
        const seenDeps = new Set();
        
        while ((match = importRegex.exec(file.content)) !== null) {
          let importPath = match[1] || match[2] || match[3];
          if (!importPath) continue;

          // Relative imports
          if (importPath.startsWith(".")) {
            let normalized = importPath.replace(/\\/g, "/");
            const currentDir = path.split("/").slice(0, -1).join("/");
            
            let absoluteImport;
            if (normalized.startsWith("./")) {
              absoluteImport = (currentDir ? currentDir + "/" : "") + normalized.substring(2);
            } else if (normalized.startsWith("../")) {
              let upCount = 0;
              let temp = normalized;
              while (temp.startsWith("../")) {
                upCount++;
                temp = temp.substring(3);
              }
              const dirParts = currentDir.split("/");
              if (dirParts.length >= upCount) {
                absoluteImport = dirParts.slice(0, dirParts.length - upCount).join("/") + (dirParts.length > upCount ? "/" : "") + temp;
              }
            }

            if (!absoluteImport) continue;

            const extensions = ["", ".js", ".jsx", ".ts", ".tsx", ".json", "/index.js", "/index.jsx", "/index.ts", "/index.tsx"];
            const targetFile = extensions
              .map(ext => absoluteImport + ext)
              .find(p => pathSet.has(p));

            if (targetFile && targetFile !== path && !seenDeps.has(targetFile)) {
              seenDeps.add(targetFile);
              edges.push({
                id: `dep-${path}-${targetFile}`,
                source: path,
                target: targetFile,
                label: "imports",
                animated: true,
                style: { stroke: "rgba(99, 102, 241, 0.4)", strokeWidth: 1.5 }
              });
            }
          }
          
          // Detect API calls from frontend to backend
          if ((importPath.includes("axios") || file.content.includes("fetch(")) && !seenDeps.has("__api__")) {
            const apiMatch = file.content.match(/['"]\/(api\/.*?)['"]/);
            if (apiMatch) {
              const apiPath = apiMatch[1];
              // Try to find a route file that matches this API path
              const routeFile = filePaths.find(p => (p.includes("routes") || p.includes("api")) && p.toLowerCase().includes(apiPath.split("/")[1]?.toLowerCase() || ""));
              if (routeFile && routeFile !== path) {
                seenDeps.add("__api__");
                edges.push({
                  id: `api-${path}-${routeFile}`,
                  source: path,
                  target: routeFile,
                  label: "calls api",
                  animated: true,
                  style: { stroke: "#ec4899", strokeWidth: 2, strokeDasharray: "5 5" }
                });
              }
            }
          }
        }
      }
    });

    // Remove potential duplicate edges
    const finalEdges = [];
    const edgeIds = new Set();
    edges.forEach(edge => {
      if (edge && edge.id && !edgeIds.has(edge.id)) {
        edgeIds.add(edge.id);
        finalEdges.push(edge);
      }
    });

    return { nodes, edges: finalEdges };
  } catch (error) {
    console.error("Graph generation error:", error);
    return { nodes: [], edges: [] };
  }
};
