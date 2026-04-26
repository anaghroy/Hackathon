import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { githubLoginUrl, googleLoginUrl } from "../services/authApi.service";
import useForm from "../hooks/useForm";
import { authValidator } from "../utils/validators";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading } = useAuth();
  
  const { values, errors, handleChange, handleBlur, validateAll } = useForm(
    { identifier: "", password: "" },
    authValidator
  );

  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    
    try {
      await handleLogin(values);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-page">
      <header className="auth-header">
        <div className="logo">SQUADRA</div>
        <div className="header-right">
          <Link to="/register" className="nav-link mono">SIGN UP</Link>
        </div>
      </header>

      <main className="auth-container">
        <section className="auth-visual">
          <div className="visual-content">
            <h1>COMMAND & <br />CONTROL.</h1>
            <p>
              The institutional platform for high-performance squads. 
              Access your mission-critical dashboards and operations.
            </p>
            
            <div className="visual-footer">
              <span className="line"></span>
              <span className="brand-tag mono">SQUADRA SYSTEMS INC.</span>
            </div>
          </div>
          <div className="visual-grid"></div>
          <div className="visual-overlay"></div>
        </section>

        <section className="auth-form-section">
          <div className="form-card">
            <header className="form-header">
              <h2>Login</h2>
              <p>Welcome back. Enter your credentials to continue.</p>
            </header>

            <form onSubmit={submitHandler}>
              <div className="input-group">
                <label className="input-label mono">Email or Username</label>
                <input
                  className={`input-field ${errors.identifier ? "input-error" : ""}`}
                  type="text"
                  name="identifier"
                  placeholder="name@squadra.com"
                  value={values.identifier}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.identifier && (
                  <p className="error-text mono">{errors.identifier}</p>
                )}
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label className="input-label mono">Password</label>
                  <Link to="/forgot-password" id="forgot-link" className="mono">
                    Forgot?
                  </Link>
                </div>
                <div className="input-wrapper">
                  <input
                    className={`input-field ${errors.password ? "input-error" : ""}`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-text mono">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "SIGN IN"}
              </button>
            </form>

            <div className="divider">
              <span className="mono">OR CONTINUE WITH</span>
            </div>

            <div className="social-login">
              <a className="btn btn-google btn-full" href={googleLoginUrl}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.044l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.956l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Google
              </a>
              <a className="btn btn-github btn-full" href={githubLoginUrl}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                GitHub
              </a>
            </div>

            <p className="bottom-text">
              Don't have an account? <Link to="/register">Request Access</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
