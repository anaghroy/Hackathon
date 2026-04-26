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

      summary.totalLines += lines;

      summary.fileList.push({
        name: file.filename,
        lines,
      });
    });

    return summary;
  } catch (error) {
    console.error(error);
    throw new Error("Error parsing project files");
  }
};