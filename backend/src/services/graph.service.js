export const generateGraph = (files) => {
  let nodes = [];
  let edges = [];

  // store full paths
  const filePaths = new Set(files.map((f) => f.filename));

  files.forEach((file) => {
    const sourceFile = file.filename;

    nodes.push({ 
      id: sourceFile,
      data: { label: sourceFile.split('/').pop() }, // Show only filename as label
      position: { x: Math.random() * 600, y: Math.random() * 600 }
    });

    const importRegex =
      /import\s+.*?from\s+['"](.*?)['"]|require\(['"](.*?)['"]\)/g;

    let match;

    while ((match = importRegex.exec(file.content)) !== null) {
      let importPath = match[1] || match[2];

      if (!importPath) continue;

      // ignore external libs
      if (!importPath.startsWith(".")) continue;

      // normalize path
      let normalized = importPath
        .replace(/^(\.\/|\.\.\/)+/, "") // remove ../
        .replace(/\\/g, "/");

      // possible matches
      const possibleMatches = [
        normalized,
        normalized + ".js",
        normalized + ".jsx",
        normalized + ".json",
      ];

      // find correct file
      const targetFile = [...filePaths].find((filePath) =>
        possibleMatches.some((p) => filePath.endsWith(p))
      );

      if (targetFile) {
        edges.push({
          source: sourceFile,
          target: targetFile,
        });
      }
    }
  });

  // remove duplicates
  nodes = [...new Map(nodes.map((n) => [n.id, n])).values()];

  return { nodes, edges };
};