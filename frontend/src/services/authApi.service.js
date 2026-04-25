import axios from "axios";

const authApi = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
  timeout: 10000,
});

/* Register */
export const registerUser = async (userData) => {
  const response = await authApi.post("/register", userData);
  return response.data;
};

/* Login */
export const loginUser = async (userData) => {
  const response = await authApi.post("/login", userData);
  return response.data;
};

/* Get Current User */
export const getMe = async () => {
  const response = await authApi.get("/get-me");
  return response.data;
};

/* Logout */
export const logoutUser = async () => {
  const response = await authApi.post("/logout");
  return response.data;
};

/* Verify Email */
export const verifyEmail = async (token) => {
  const response = await authApi.get(`/verify-email?token=${token}`);
  return response.data;
};

/* Resend Verification */
export const resendVerification = async (email) => {
  const response = await authApi.post("/resend-verification", {
    email,
  });
  return response.data;
};

/* Forgot Password */
export const forgotPassword = async (emailData) => {
  const response = await authApi.post("/forgot-password", emailData);
  return response.data;
};

/* Reset Password */
export const resetPassword = async (passwordData) => {
  const response = await authApi.post("/reset-password", passwordData);
  return response.data;
};

/* Update Profile */
export const updateProfile = async (profileData) => {
  const response = await authApi.put("/update-profile", profileData);
  return response.data;
};

/* Upload Profile Picture */
export const uploadProfilePicture = async (formData) => {
  const response = await authApi.post("/upload-profile-picture", formData);
  return response.data;
};

/* OAuth URLs */
export const googleLoginUrl = "/api/auth/google";
export const githubLoginUrl = "/api/auth/github";

export default authApi;
