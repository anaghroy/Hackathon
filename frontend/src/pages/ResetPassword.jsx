import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useForm from "../hooks/useForm";
import { authValidator } from "../utils/validators";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Shield, CircleHelp, Check, Circle, RotateCcw } from "lucide-react";
import brandLogo from "../assets/Brand logo.png";

const ResetPassword = () => {
  const { handleResetPassword, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const { values, errors, handleChange, handleBlur, validateAll } = useForm(
    { password: "", confirmPassword: "" },
    authValidator
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    await handleResetPassword({
      token,
      ...values,
    });

    navigate("/login");
  };

  return (
    <div className="reset-password-page">
      <header className="reset-header">
        <div className="logo-area">
          <Link to="/" className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={brandLogo} alt="CogniCode Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            CogniCode
          </Link>
        </div>
        
        <nav className="nav-center">
          <Link to="#">PLATFORM</Link>
          <Link to="#">RESOURCES</Link>
          <Link to="#">ENTERPRISE</Link>
        </nav>

        <div className="header-right">
          <CircleHelp size={20} />
        </div>
      </header>

      <main className="reset-container">
        <div className="reset-card">
          <header className="form-header">
            <h2>Reset Password</h2>
            <p>Create a new secure password for your account.</p>
          </header>

          <form onSubmit={submitHandler}>
            <div className="input-group">
              <label className="input-label mono">New Password</label>
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
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Strength Meter (Mobile Identity) */}
              <div className="strength-meter">
                <div className="segments">
                  <div className="segment active-moderate"></div>
                  <div className="segment active-moderate"></div>
                  <div className="segment"></div>
                  <div className="segment"></div>
                </div>
                <div className="strength-text mono">STRENGTH: MODERATE</div>
              </div>

              {errors.password && (
                <p className="error-text mono">{errors.password}</p>
              )}
            </div>

            <div className="input-group">
              <label className="input-label mono">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  className={`input-field ${errors.confirmPassword ? "input-error" : ""}`}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-text mono">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Security Standards (Mobile Identity) */}
            <div className="security-standards">
              <div className="icon-area">
                <Shield size={18} />
              </div>
              <div className="text-area">
                <h4 className="mono">Security Standards</h4>
                <p>
                  Ensure your password is at least 12 characters long and 
                  includes a mix of numbers and symbols.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-white btn-full"
              disabled={loading}
            >
              {loading ? "UPDATING..." : "RESET PASSWORD"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <Link to="/login" className="back-link mono">
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>

          <div className="reset-bottom-icon">
            <div className="icon-wrapper">
              <RotateCcw size={24} />
            </div>
          </div>
        </div>
      </main>

      <footer className="auth-footer mono">
        <div className="footer-left">
          © 2024 CogniCode SYSTEMS. ALL RIGHTS RESERVED.
        </div>
        <div className="footer-right">
          <Link to="#">PRIVACY POLICY</Link>
          <Link to="#">TERMS OF SERVICE</Link>
          <Link to="#">SUPPORT</Link>
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;

