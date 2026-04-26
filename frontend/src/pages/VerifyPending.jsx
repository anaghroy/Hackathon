import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const VerifyPending = () => {
  const { handleResendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("verifyEmail");

  console.log(email);
  

  const resendHandler = async () => {
    if (!email) {
      alert("Email not found");
      return;
    }

    await handleResendVerification(email);
  };

  return (
    <section className="verify-page">
      <div className="verify-card">
        <h2>Verify Your Email</h2>

        <p>
          We have sent a verification email to <b>{email}</b>
        </p>

        <button onClick={resendHandler} className="btn-primary">
          Resend Email
        </button>

        <button onClick={() => navigate("/login")} className="btn-secondary">
          Go to Login
        </button>
      </div>
    </section>
  );
};

export default VerifyPending;
