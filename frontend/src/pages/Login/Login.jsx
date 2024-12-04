
import { useState, useEffect } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Invalid from "./validations/invalid/Invalid";
import Valid from "./validations/valid/Valid";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [isUserFocus, setUserFocus] = useState(false);
  const [isPasswordFocus, setPasswordFocus] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isNotValid, setIsNotValid] = useState(false);
  const navigate = useNavigate();

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      console.log("Login successful");
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsNotValid(false); // Ensure it resets
    }
    
  };
  

  useEffect(() => {
    document.title = "Login Page";
  }, []);

  return (
    <div className="loginWrapper">
      {isNotValid && <Invalid />}
      <form onSubmit={handleLogin}>
        <div className="loginContainer">
          <div className="header">
            <FaUser id="logo" />
            <h3>
              Welcome back, <br /> Login into your Account
            </h3>
          </div>
          <div className="fieldContainer">
            <div className="username">
              <h5 className={isUserFocus ? "userText active" : "userText"}>Username:</h5>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="password">
              <h5 className={isPasswordFocus ? "passText active" : "passText"}>Password:</h5>
              <div className="passwordField">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <a href="#">Forgot Password?</a>
            </div>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
