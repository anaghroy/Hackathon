import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

export async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "No token provided",
    });
  }
 
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    
    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        user.passwordChangedAt.getTime() / 1000,
      );

      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({
          message: "Token expired due to password change",
          success: false,
        });
      }
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Invalid token",
    });
  }
}
