import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import vid from "./bg2.mp4";
import vide from "./bg4.mp4";
import "./SignUp.css";

const SignUp = () => {
  const passwordPattern = {
    lowerCase: /(?=.*[a-z])/,
    upperCase: /(?=.*[A-Z])/,
    digit: /(?=.*\d)/,
    specialChar: /(?=.*[@$!%*?&])/,
    length: /.{8,15}/,
  };
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const [userAgreement, setUserAgreement] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState(32);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [screenSize]);

  // Fetch states on component mount
  useEffect(() => {
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
      .then((response) => response.json())
      .then((data) => setStates(data.states))
      .catch((error) => console.error("Error fetching states:", error));
  }, []);

  // Fetch districts when selectedState changes
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

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      username,
      email,
      password,
      location: districts.find((dist) => dist.district_id == selectedDistrict)
        ?.district_name,
    };

    try {
      const response = await fetch(`http://${LOCAL_IP}:5000/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Sign Up Successful!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const isLowerCase = passwordPattern.lowerCase.test(password);
  const isUpperCase = passwordPattern.upperCase.test(password);
  const isDigit = passwordPattern.digit.test(password);
  const isSpecialChar = passwordPattern.specialChar.test(password);
  const isLengthValid = passwordPattern.length.test(password);

  return (
    <div className="singupWrapper">
      <video
        src={screenSize <= 850 ? vide : vid}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: -1,
        }}
      ></video>
      <div className="signupContainer">
        <div className="header">
          <h2>Sign Up to VrikshaRakshak</h2>
        </div>
        <form action="#">
          <div className="signupfieldContainer">
            <div className="username fieldwrapper">
              <label htmlFor="username">
                Username<span className="star">*</span>:
              </label>
              <input
                className="inputboxes"
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  console.log(e.target);
                  setUsername(e.target.value);
                }}
                required
              />
            </div>
            <div className="email fieldwrapper">
              <label htmlFor="email">
                Email <span className="star">*</span>:{" "}
              </label>
              <input
                className="inputboxes"
                type="email"
                id="email"
                name="email"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                required
              />
            </div>
            <div className="passwordSignup fieldwrapper">
              <label htmlFor="password">
                Password<span className="star">*</span>:
              </label>
              <div className="passwordfield">
                <input
                  className="inputboxes"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$"
                  required
                />
                <button
                  className="showButt"
                  type="button"
                  onClick={() => setshowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="password-constraints">
                <p style={{ color: isLowerCase ? "green" : "red" }}>
                  At least one lowercase letter
                </p>
                <p style={{ color: isUpperCase ? "green" : "red" }}>
                  At least one uppercase letter
                </p>
                <p style={{ color: isDigit ? "green" : "red" }}>
                  At least one digit
                </p>
                <p style={{ color: isSpecialChar ? "green" : "red" }}>
                  At least one special character (@$!%*?&)
                </p>
                <p style={{ color: isLengthValid ? "green" : "red" }}>
                  8 to 15 characters long
                </p>
              </div>
            </div>
            <div className="confirmpassword fieldwrapper">
              <label htmlFor="confirmpassword">
                Confirm Password<span className="star">*</span>:
              </label>
              <input
                className="inputboxes"
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="addressWrapper">
              <div className="statewrapper selection">
                <label htmlFor="state">
                  State<span className="star">*</span>:
                </label>
                <select
                  id="state"
                  className="dropdown"
                  required={true}
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.state_id} value={state.state_id}>
                      {state.state_name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedState && (
                <div className="districtwrapper selection">
                  <label htmlFor="district">
                    District<span className="star">*</span>:
                  </label>
                  <select
                    id="district"
                    className="dropdown"
                    required={true}
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option
                        key={district.district_id}
                        value={district.district_id}
                      >
                        {district.district_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="agreement">
              <input
                type="checkbox"
                id="useragreement"
                checked={userAgreement}
                onChange={() => {
                  setUserAgreement((e) => !e);
                }}
                required
              />
              <label htmlFor="useragreement">
                I agree with VrikshaRakshak's <a href="#">Terms of Service</a> ,{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>
            <div className="submitButton">
              <button type="submit">Sign Up</button>
            </div>
          </div>
        </form>
        <div className="dontAccount">
          <p>
            Already have Account ? <Link to="/">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
