
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignUp.css";
import { useNavigate } from "react-router-dom"; 
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userAgreement, setUserAgreement] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const signupError = useAuthStore((state) => state.error);
  const signupLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
      .then((response) => response.json())
      .then((data) => setStates(data.states))
      .catch((error) => console.error("Error fetching states:", error));
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetch(
        `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${selectedState}`
      )
        .then((response) => response.json())
        .then((data) => setDistricts(data.districts))
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectedState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      await signup(email, password, username, selectedDistrict);
      alert("Signup successful!");
      navigate("/home"); 
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="singupWrapper">
      <div className="signupContainer">
        <h2>Sign Up to VrikshaRakshak</h2>
        {signupError && <p className="error">{signupError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="signupfieldContainer">
            <label htmlFor="username">
              Username<span className="star">*</span>
            </label>
            <input
              type="text"
              id="username"
              className="inputboxes"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="signupfieldContainer">
            <label htmlFor="email">
              Email<span className="star">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="inputboxes"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="signupfieldContainer passwordfield">
            <label htmlFor="password">
              Password<span className="star">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="inputboxes"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="showButt"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="signupfieldContainer">
            <label htmlFor="confirmPassword">
              Confirm Password<span className="star">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="inputboxes"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="signupfieldContainer addressWrapper">
            <label htmlFor="state">State<span className="star">*</span></label>
            <select
              id="state"
              className="selection"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              required
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.state_id} value={state.state_id}>
                  {state.state_name}
                </option>
              ))}
            </select>
          </div>

          <div className="signupfieldContainer addressWrapper">
            <label htmlFor="district">District<span className="star">*</span></label>
            <select
              id="district"
              className="selection"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              required
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>

          <div className="agreement">
            <input
              type="checkbox"
              id="userAgreement"
              checked={userAgreement}
              onChange={() => setUserAgreement(!userAgreement)}
              required
            />
            <label htmlFor="userAgreement">
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </label>
          </div>

          <div className="submitButton">
          <button type="submit" disabled={signupLoading}>
  {signupLoading ? "Signing up..." : "Sign Up"}
</button>

          </div>
        </form>

        <div className="or">
          <p>or</p>
        </div>
        <div className="googleButton">
          <a>
            <FcGoogle id="google" />
            <span>Continue with Google</span>
          </a>
        </div>

        <p>
          Already have an account? <Link to="/">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
