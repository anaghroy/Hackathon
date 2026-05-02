import mongoose from "mongoose";

const accountSettingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "en",
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    logExplorerTheme: {
      type: String,
      default: "Match Dashboard",
    },
    loginMethods: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const accountSettingModel = mongoose.model("AccountSetting", accountSettingSchema);

export default accountSettingModel;
