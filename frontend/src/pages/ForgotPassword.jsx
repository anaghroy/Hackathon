import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword = () => {
  const { handleForgotPassword, loading } = useAuth();

  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    await handleForgotPassword({ email });
  };

  return (
    <div className="auth-page">
      <h2>Forgot Password</h2>

      <form onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
