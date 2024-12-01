import React, { useState } from "react";
import OtpVerification from './OtpVerification';
import forgot from './forgot-password.png'
import '../../styles/ForgotPassword.css';
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestOtp = async () => {
    try {
      const response = await fetch("/api/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setOtpSent(true);
      } 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="ForgotPasswordContainer">
      {!otpSent ? (
        <div className="forgotpassword">
          <img src={forgot} alt="forgotPassword" />
          <h2>Forgot Password</h2>
          <form >
          <input className="forgotInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button className="button">Send OTP</button>
          </form>
        </div>
      ) : (
        <OtpVerification email={email} />
      )}
    </div>
  );
}

export default ForgotPassword;
