const calculateComplexity = (content) => {
  if (!content) return 1;
  // Basic heuristic: count branching and looping keywords/operators
  const keywords = ['if\\s*\\(', 'for\\s*\\(', 'while\\s*\\(', 'case\\s', 'catch\\s*\\(', '\\|\\|', '&&', '\\?'];
  let complexity = 1;
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g');
    const matches = content.match(regex);
    if (matches) {
      complexity += matches.length;
    }
  });
  return complexity;
};

export const parseProjectFiles = (files) => {
  try {
    const summary = {
      totalFiles: files.length,
      fileTypes: {},
      fileList: [],
      totalLines: 0,
    };

    files.forEach((file) => {
      const ext = file.filename.split(".").pop();

      // count file types
      summary.fileTypes[ext] = (summary.fileTypes[ext] || 0) + 1;

      // count lines
      const lines = file.content.split("\n").length;
      
      const complexity = calculateComplexity(file.content);

      summary.totalLines += lines;

      summary.fileList.push({
        name: file.filename,
        lines,
        complexity,
      });
    });

    return summary;
  } catch (error) {
    console.error(error);
    throw new Error("Error parsing project files");
  }
};