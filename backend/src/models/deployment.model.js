import mongoose from "mongoose";

const deploymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["QUEUED", "BUILDING", "DEPLOYING", "SUCCESS", "FAILED"],
      default: "QUEUED",
    },
    commitHash: {
      type: String,
      default: "latest",
    },
    url: {
      type: String,
    },
    logs: [
      {
        timestamp: { type: Date, default: Date.now },
        message: String,
        type: { type: String, enum: ["stdout", "stderr", "system"] },
      },
    ],
  },
  { timestamps: true }
);

const Deployment = mongoose.model("Deployment", deploymentSchema);
export default Deployment;
