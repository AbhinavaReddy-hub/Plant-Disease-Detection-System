import { useState } from "react";
import secure from './secured.png';
import reset from './reset-password.png';

export default function OtpVerification({ email }) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [isPasswordReset, setPasswordReset] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch("/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otp.join("") }),  // Join OTP array into a single string
            });
            if (response.ok) {
                setOtpVerified(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleResetPassword = async () => {
        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });
            if (response.ok) {
                setPasswordReset(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleOtpChange = (e, index) => {
        let newOtp = [...otp];
        newOtp[index] = e.target.value.slice(0, 1);
        setOtp(newOtp);
        if (e.target.value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    return (
        <div className="OtpContainer">
            {!otpVerified ? (
                <div className="EnteringOtp">
                    <img src={secure} alt="" />
                    <h3>Enter your OTP</h3>
                    <form>
                        <div className="otp-blocks">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    maxLength="1"
                                    placeholder="-"
                                    required
                                />
                            ))}
                        </div>
                        <button className="button" type="submit" onClick={handleVerifyOtp}>Verify OTP</button>
                    </form>
                </div>
            ) : (
                <div className="newPasswordFunction">
                    <img src={reset} alt="" />
                    <h3>Reset Your Password</h3>
                    <form>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            required
                        />
                        <button className="button" type="submit" onClick={handleResetPassword}>Reset Password</button>
                    </form>
                </div>
            )}
        </div>
    );
}
