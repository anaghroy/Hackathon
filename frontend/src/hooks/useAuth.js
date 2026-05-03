import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  setLoading,
  setUser,
  setError,
  logoutUser as logoutAction,
} from "../store/slices/authSlice";

import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  updateProfile,
  uploadProfilePicture,
} from "../services/authApi.service";

export const useAuth = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  const startLoading = () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
  };

  const stopLoading = () => {
    dispatch(setLoading(false));
  };

  const handleApiError = (error, fallbackMessage) => {
    console.log(error);

    const message =
      error?.response?.data?.message || error?.message || fallbackMessage;

    dispatch(setError(message));
    toast.error(message);
  };

  /* Register */

  // useAuth.js

  const handleRegister = async (formData) => {
    try {
      startLoading();

      const data = await registerUser(formData);

      toast.success(data.message || "Registered Successfully");

      return {
        success: true,
        ...data,
      };
    } catch (error) {
      handleApiError(error, "Register Failed");

      return {
        success: false,
      };
    } finally {
      stopLoading();
    }
  };

  /* Login */
  const handleLogin = async (formData) => {
    try {
      startLoading();

      const data = await loginUser(formData);

      dispatch(setUser(data.user));
      toast.success(data.message || "Login Successful");

      return data;
    } catch (error) {
      handleApiError(error, "Login Failed");
      throw error;
    } finally {
      stopLoading();
    }
  };

  /* Current User */
  const handleGetMe = async () => {
    try {
      startLoading();

      const data = await getMe();

      dispatch(setUser(data.user));

      return data;
    } catch (error) {
      dispatch(logoutAction());
      throw error;
    } finally {
      stopLoading();
    }
  };

  /* Logout */
  const handleLogout = async () => {
    try {
      startLoading();

      const data = await logoutUser();

      dispatch(logoutAction());
      toast.success(data.message || "Logout Successful");

      return data;
    } catch (error) {
      handleApiError(error, "Logout Failed");
      throw error;
    } finally {
      stopLoading();
    }
  };

  /* Verify Email */
  const handleVerifyEmail = async (token) => {
    try {
      startLoading();

      const data = await verifyEmail(token);

      toast.success(data.message || "Email Verified");

      return data;
    } catch (error) {
      handleApiError(error, "Verification Failed");
      throw error;
    } finally {
      stopLoading();
    }
  };

  /* Resend Verification */
  const handleResendVerification = async (email) => {
    try {
      startLoading();

      const data = await resendVerification(email);

      toast.success(data.message || "Verification Email Sent");

      return data;
    } catch (error) {
      handleApiError(error, "Resend Failed");
      throw error;
    } finally {
      stopLoading();
    }
  };

  /* Forgot Password */
  const handleForgotPassword = async (emailData) => {
    try {
      startLoading();

      const data = await forgotPassword(emailData);

      toast.success(data.message || "Reset Link Sent");

      return data;
    } catch (error) {
      handleApiError(error, "Forgot Password Failed");
      throw error;
    } finally {
      stopLoading();
    }
  };

  /* Reset Password */
  const handleResetPassword = async (passwordData) => {
    try {
      startLoading();

      const data = await resetPassword(passwordData);

      toast.success(data.message || "Password Reset Successful");

      return data;
    } catch (error) {
      handleApiError(error, "Reset Password Failed");
      throw error;
    } finally {
      stopLoading();
    }
  };

  /* Update Profile */
  const handleUpdateProfile = async (profileData) => {
    try {
      startLoading();

      const data = await updateProfile(profileData);

      dispatch(setUser(data.user));

      return data;
    } catch (error) {
      handleApiError(error, "Update Failed");
      throw error;
    } finally {
      stopLoading();
    }
  };

  /* Upload Profile Picture */
  const handleUploadProfilePicture = async (formData) => {
    try {
      startLoading();

      const data = await uploadProfilePicture(formData);

      // Backend uploadProfilePicture doesn't return the full user object
      // We fetch fresh user data to keep state in sync and prevent redirects
      await handleGetMe();

      toast.success(data.message || "Profile Picture Updated");

      return data;
    } catch (error) {
      handleApiError(error, "Upload Failed");
      throw error;
    } finally {
      stopLoading();
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,

    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,

    handleVerifyEmail,
    handleResendVerification,

    handleForgotPassword,
    handleResetPassword,

    handleUpdateProfile,
    handleUploadProfilePicture,
  };
};

export default useAuth;
