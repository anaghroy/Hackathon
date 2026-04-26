import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    graph: Object,
    explanation: String,
  },
  { timestamps: true }
);

export default mongoose.model("AIAnalysis", aiAnalysisSchema);