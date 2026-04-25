import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
  const { handleResetPassword, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    await handleResetPassword({
      token,
      ...formData,
    });

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <h2>Reset Password</h2>

      <form onSubmit={submitHandler}>
        <input
          type="password"
          placeholder="New Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />

        <button disabled={loading}>
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
