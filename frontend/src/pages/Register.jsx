import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { googleLoginUrl, githubLoginUrl } from "../services/authApi.service";
import { useSelector } from "react-redux";

const Register = () => {
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();
  const { errors } = useSelector((state) => state.auth);

  console.log(errors);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await handleRegister(formData);

      localStorage.setItem("verifyEmail", formData.email);

      navigate("/verify-pending"); // 🔥 IMPORTANT
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="register-page">
      {/* LEFT SIDE */}
      <div className="register-banner">
        <div className="overlay">
          <h1>Create Account</h1>
          <p>Join us and start building something amazing.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-form-area">
        <div className="register-card">
          <h2>Register</h2>
          <p>Create your new account</p>

          <form onSubmit={submitHandler}>
            <div className="input-group">
              <label>Username</label>
              <input
                className="input-field"
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                className="input-field"
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-box">
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="social-login">
            <a href={googleLoginUrl}>Continue with Google</a>
            <a href={githubLoginUrl}>Continue with GitHub</a>
          </div>

          {/* REDIRECT */}
          <p className="bottom-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
