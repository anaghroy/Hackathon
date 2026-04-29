import accountSettingModel from "../models/accountSetting.model.js";
import userModel from "../models/user.model.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await accountSettingModel.findOne({ userId: req.user.id });

    if (!settings) {
      // Fetch the user to get their provider
      const user = await userModel.findById(req.user.id);
      
      const loginMethods = [];
      if (user && user.provider) {
        loginMethods.push(user.provider); // e.g., "local", "github", "google"
      }

      settings = await accountSettingModel.create({
        userId: req.user.id,
        loginMethods: loginMethods,
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching account settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch account settings",
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    // Ensure users cannot update sensitive fields like userId or inject other IDs
    delete updates.userId;

    const settings = await accountSettingModel.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Account settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error updating account settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update account settings",
    });
  }
};
