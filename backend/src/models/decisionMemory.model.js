import mongoose from "mongoose";

const decisionMemorySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    title: {
      type: String, // short title
    },

    description: {
      type: String, // WHY written
      required: true,
    },

    codeSnippet: {
      type: String,
    },

    tags: {
      type: [String], // performance, bugfix, ui, etc.
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    source: {
      type: String,
      enum: ["user", "ai"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DecisionMemory", decisionMemorySchema);