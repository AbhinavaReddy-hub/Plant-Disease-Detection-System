import { useState, useEffect } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import { Link } from "react-router-dom";
import Invalid from "./validations/invalid/Invalid";
import Valid from './validations/valid/Valid';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isUserFocus, setUserFocus] = useState(false);
  const [isPasswordFocus, setPasswordFocus] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isNotValid, setIsNotValid] = useState(false);
  const [timeOutWorking, setTimeOutWorking] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Login Page";
  }, []);

  const users = [
    { id: 1, username: 'shah', password: 'Kmit@123$',},
    { id: 2, username: 'ozair', password: 'kmit123#',},
    { id:3, username: 'kt', password:'leetcode', },
  ];

  return (
    <div className="loginWrapper">
      {isValid && <Valid uname={username} />}
      {isNotValid && <Invalid />}
      <form action="#" onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const uname = formData.get('username');
        const psw = formData.get('password');

        const user = users.find(
          (u) => u.username === uname && u.password === psw
        );
        
        if (user) {
          if (!timeOutWorking) {
            setIsValid(true);
            setTimeOutWorking(true);
            setTimeout(() => {
              setIsValid(false);
              setTimeOutWorking(false);
            }, 2500);
            sessionStorage.setItem('user',JSON.stringify(user));
            navigate("/home");
          }
        } else {
          if (!timeOutWorking) {
            setIsNotValid(true);
            setTimeOutWorking(true);
            setTimeout(() => {
              setIsNotValid(false);
              setTimeOutWorking(false);
            }, 3500);
          }
        }
      }}>
        <div className="loginContainer">
          <div className="header">
            <FaUser id="logo" />
            <h3 style={{ textAlign: "center" }}>
              Welcome back,
              <br />
              Login into your Account
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
                onFocus={() => !isUserFocus && setUserFocus(true)}
                onBlur={() => isUserFocus && setUserFocus(false)}
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
                  onFocus={() => !isPasswordFocus && setPasswordFocus(true)}
                  onBlur={() => isPasswordFocus && setPasswordFocus(false)}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="showbutton" type="button" onClick={() => setshowPassword((prev) => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <a href="#">
                <p>Forgot Password?</p>
              </a>
            </div>
          </div>
          <div className="loginbutton">
            <button type="submit">Login</button>
          </div>
          <div className="dontAccount">
            <p>
              {"Don't have an Account? Create one"} <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
