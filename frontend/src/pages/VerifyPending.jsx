import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const VerifyPending = () => {
  const { handleResendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("verifyEmail");

  const resendHandler = async () => {
    if (!email) {
      alert("Email not found");
      return;
    }
    await handleResendVerification(email);
  };

  return (
    <section className="verify-page">
      <div className="verify-background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="verify-card">
        <div className="status-icon">
          <div className="icon-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" />
              <polyline points="22,7 12,14 2,7" />
              <path d="M16 19l2 2 4-4" />
            </svg>
          </div>
        </div>

        <header className="card-header">
          <h2>Verify your email</h2>
          <p>
            We've sent a secure verification link to <br />
            <span className="user-email">{email || "your inbox"}</span>
          </p>
        </header>

        <div className="action-area">
          <button onClick={resendHandler} className="btn btn-primary btn-full">
            Resend Email
          </button>

          <button onClick={() => navigate("/login")} className="btn btn-outline btn-full">
            Back to Login
          </button>
        </div>

        <footer className="card-footer">
          <p>Did not receive an email? Check your spam folder.</p>
        </footer>
      </div>
    </section>
  );
};

export default VerifyPending;
