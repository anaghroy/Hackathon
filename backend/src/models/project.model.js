import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  files: [
    {
      filename: String,
      content: String,
    },
  ],
  repoProvider: {
    type: String,
    enum: ["github", "gitlab", "bitbucket"],
  },
  repoName: String,
  branch: {
    type: String,
    default: "main",
  },
  buildCommand: String,
  envVars: {
    type: Map,
    of: String,
    default: {},
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
