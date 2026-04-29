import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useForm from "../hooks/useForm";
import { authValidator } from "../utils/validators";
import { ArrowLeft, ArrowRight } from "lucide-react";
import brandLogo from "../assets/Brand logo.png";

const ForgotPassword = () => {
  const { handleForgotPassword, loading } = useAuth();

  const { values, errors, handleChange, handleBlur, validateAll } = useForm(
    { email: "" },
    authValidator
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    await handleForgotPassword(values);
  };

  return (
    <div className="forgot-password-page">
      <header className="forgot-header">
        <Link to="/login" className="logo-link">
          <img src={brandLogo} alt="CogniCode Logo" style={{ width: "24px", height: "24px", objectFit: "contain", marginRight: "8px" }} />
          <span>CogniCode NETWORK</span>
        </Link>
      </header>

      <main className="forgot-container">
        <section className="forgot-visual">
          <div className="visual-content">
            <h1>RESTORE ACCESS. <br />REGAIN CONTROL.</h1>
            <div className="line"></div>
          </div>
        </section>

        <section className="forgot-form-section">
          <div className="forgot-card">
            <header className="form-header">
              <h2>Forgot Password</h2>
              <p>
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </header>

            <form onSubmit={submitHandler}>
              <div className="input-group">
                <label className="input-label mono">Email Address</label>
                <input
                  className={`input-field ${errors.email ? "input-error" : ""}`}
                  type="email"
                  name="email"
                  placeholder="name@institution.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && (
                  <p className="error-text mono">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-white btn-full"
                disabled={loading}
              >
                {loading ? "SENDING..." : "SEND RESET LINK"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <Link to="/login" className="back-to-login mono">
              <ArrowLeft />
              BACK TO LOGIN
            </Link>
          </div>

          <div className="security-protocol">
            <div className="protocol-header">
              <div className="square"></div>
              <span>SECURITY PROTOCOL</span>
            </div>
            <p>
              Your data is encrypted using military-grade standards. 
              Recovery links are valid for 15 minutes for your protection.
            </p>
          </div>
        </section>
      </main>

      <footer className="auth-footer mono">
        <div className="footer-left">
          © 2024 CogniCode INSTITUTIONAL. ALL RIGHTS RESERVED.
        </div>
        <div className="footer-right">
          <Link to="#">SUPPORT</Link>
          <Link to="#">PRIVACY POLICY</Link>
          <Link to="#">SECURITY PROTOCOL</Link>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;

