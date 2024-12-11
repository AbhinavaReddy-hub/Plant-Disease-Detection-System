import clickPhoto from "./aboutUs.png";
// import { Link } from "react-router-dom";
import { useDarkMode } from "../../../DarkModeContext";
import DiagnosticPageLink from "../diagnosticpagelink/DiagnosticPageLink";
import { useState, useEffect } from "react";
import demo from "./demo.mov";
import "./AboutUs.css";

export default function AboutUs() {
  const { isDarkMode, setDarkMode } = useDarkMode();
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "Discover\nPlant Health Instantly";

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (isTyping) {
          if (index < fullText.length) {
            setDisplayText((prev) => prev + fullText[index]);
            setIndex((prev) => prev + 1);
          } else {
            setTimeout(() => {
              setIsTyping(false);
            }, 1000);
          }
        } else {
          if (index > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
            setIndex((prev) => prev - 1);
          } else {
            setIsTyping(true);
          }
        }
      },
      isTyping ? 100 : 50
    );
    return () => clearInterval(interval);
  }, [index, isTyping]);

  return (
    <div className="aboutUsContainer">
      <div className="c lc">
        <div className="text">
          <div className="leftContent">
            <h2
              className="slogan notranslate"
              style={{ color: "rgb(22, 152, 5)" }}
            >
              {displayText}
              {displayText && (
                <span
                  className="GradientCircle"
                  style={
                    isDarkMode
                      ? { borderRightColor: "white" }
                      : { borderRightColor: "black" }
                  }
                ></span>
              )}
            </h2>
            <p style={isDarkMode?{color:"white"}:{color:"black"}}>
              AI-powered diagnostics to identify and manage crop diseases
              effortlessly.
              <br />
              Harness cutting-edge technology to ensure healthier plants and
              better yields.
            </p>
          </div>
        </div>
        {/* <button className="diagLink"><Link to="/diagnose">Go to Diagnostic page</Link></button> */}
        <div className="diagLinkWrapper">
          <DiagnosticPageLink />
        </div>
      </div>
      <div className="c rc">
        <video
          src={demo}
          autoPlay
          loop
          muted
          playsInline
          style={{
            borderRadius: "20px",
            width: "300px",
            height: "300px",
            objectFit: "cover",
            zIndex: -1,
          }}
        ></video>
      </div>
    </div>
  );
}
