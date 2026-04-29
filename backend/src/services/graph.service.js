import { parse } from "@babel/parser";

export const generateGraph = (files) => {
  try {
    let nodes = [];
    let edges = [];

    if (!files || !Array.isArray(files)) {
      return { nodes: [], edges: [] };
    }

    const validFiles = files.filter(f => f && f.filename);
    const filePaths = validFiles.map((f) => f.filename.replace(/\\/g, "/"));
    const pathSet = new Set(filePaths);

    if (validFiles.length === 0) {
      return { nodes: [], edges: [] };
    }

    const getNodeType = (path) => {
      if (!path) return "file";
      const p = path.toLowerCase();
      const filename = path.split("/").pop()?.toLowerCase() || "";

      if (p.includes("/pages/")) return "page";
      if (p.includes("/components/")) return "component";
      if (p.includes("/hooks/")) return "hook";
      if (p.includes("/utils/")) return "util";
      if (p.includes("/controllers/")) return "controller";
      if (p.includes("/routes/") || p.includes("/api/")) return "api";
      if (p.includes("/models/") || p.includes("/schemas/")) return "database";
      if (p.includes("/middleware/")) return "middleware";
      if (p.includes("/services/")) return "service";

      if (filename === "package.json") return "config";
      if (filename === "dockerfile") return "config";

      return "file";
    };

    // -------------------------
    // FOLDERS
    // -------------------------
    const folders = new Set();
    filePaths.forEach((path) => {
      const parts = path.split("/");
      let current = "";
      for (let i = 0; i < parts.length - 1; i++) {
        current += (current ? "/" : "") + parts[i];
        folders.add(current);
      }
    });

    folders.forEach((folder) => {
      nodes.push({
        id: folder,
        type: "folder",
        data: { label: folder.split("/").pop(), path: folder },
        position: { x: 0, y: 0 },
      });
    });

    // -------------------------
    // FILES + AST PARSING
    // -------------------------
    validFiles.forEach((file) => {
      const path = file.filename.replace(/\\/g, "/");

      nodes.push({
        id: path,
        type: getNodeType(path),
        data: { label: path.split("/").pop(), path },
        position: { x: 0, y: 0 },
      });

      // Folder edge
      const parent = path.split("/").slice(0, -1).join("/");
      if (parent) {
        edges.push({
          id: `e-${parent}-${path}`,
          source: parent,
          target: path,
        });
      }

      // -------------------------
      // AST PARSING START
      // -------------------------
      if (!file.content) return;

      let ast;
      try {
        ast = parse(file.content, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
        });
      } catch (err) {
        console.log("Parse failed:", path);
        return;
      }

      const dependencies = new Set();

      const resolveImport = (importPath) => {
        if (!importPath.startsWith(".")) return null;

        const currentDir = path.split("/").slice(0, -1).join("/");

        let absolute = "";

        if (importPath.startsWith("./")) {
          absolute = currentDir + "/" + importPath.slice(2);
        } else {
          let up = 0;
          let temp = importPath;
          while (temp.startsWith("../")) {
            up++;
            temp = temp.slice(3);
          }

          const parts = currentDir.split("/");
          absolute =
            parts.slice(0, parts.length - up).join("/") +
            (parts.length > up ? "/" : "") +
            temp;
        }

        const exts = [
          "",
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".json",
          "/index.js",
          "/index.jsx",
        ];

        return exts.map(ext => absolute + ext).find(p => pathSet.has(p));
      };

      const walk = (node) => {
        if (!node || typeof node !== "object") return;

        // import x from '...'
        if (node.type === "ImportDeclaration") {
          const dep = resolveImport(node.source.value);
          if (dep) dependencies.add(dep);
        }

        // require('...')
        if (
          node.type === "CallExpression" &&
          node.callee?.name === "require"
        ) {
          const arg = node.arguments?.[0]?.value;
          const dep = resolveImport(arg);
          if (dep) dependencies.add(dep);
        }

        // dynamic import()
        if (node.type === "ImportExpression") {
          const arg = node.source?.value;
          const dep = resolveImport(arg);
          if (dep) dependencies.add(dep);
        }

        for (const key in node) {
          const child = node[key];
          if (Array.isArray(child)) {
            child.forEach(walk);
          } else if (typeof child === "object") {
            walk(child);
          }
        }
      };

      walk(ast);

      dependencies.forEach((target) => {
        edges.push({
          id: `dep-${path}-${target}`,
          source: path,
          target,
          label: "imports",
          animated: true,
        });
      });
    });

    return { nodes, edges };
  } catch (err) {
    console.error("Graph error:", err);
    return { nodes: [], edges: [] };
  }
};