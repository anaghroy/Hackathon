import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { githubLoginUrl, googleLoginUrl } from "../services/authApi.service";


const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading } = useAuth();
  
  

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await handleLogin(formData);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="login-page">
      {/* Left Panel */}
      <div className="login-banner">
        <div className="overlay">
          <h1>Welcome Back</h1>
          <p>
            Securely access your dashboard and continue building something
            amazing.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-form-area">
        <div className="card card-md login-card">
          <h2>Login</h2>
          <p>Enter your credentials to continue</p>

          <form onSubmit={submitHandler}>
            {/* Identifier */}
            <div className="input-group">
              <label className="input-label">Email or Username</label>
              <input
                className="input-field"
                type="text"
                name="identifier"
                placeholder="Enter email or username"
                value={formData.identifier}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label">Password</label>

              <input
                className="input-field"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Extra Row */}
            <div className="extra-row">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>

              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Please Wait..." : "Login"}
            </button>
          </form>

          {/* Social Login */}
          <div className="social-login">
            <a className="btn btn-outline btn-full" href={googleLoginUrl}>
              Continue with Google
            </a>

            <a className="btn btn-outline btn-full" href={githubLoginUrl}>
              Continue with GitHub
            </a>
          </div>

          {/* Bottom Text */}
          <p className="bottom-text">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
