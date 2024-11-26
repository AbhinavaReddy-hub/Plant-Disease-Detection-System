import "./AboutUs.css";
import clickPhoto from "./aboutUs.png";
import { useDarkMode } from "../homepage/DarkModeContext";
import DiagnosticPageLink from "../diagnosticpagelink/DiagnosticPageLink";

export default function AboutUs() {
  const{isDarkMode,setDarkMode}=useDarkMode();
  return (
    <div className="aboutUs">
      <div className="c lc">
        <div className="text" >
          <div className="leftContent">
            <h2 className="slogan"style={isDarkMode?{color:"white"}:{color:"black"}} >
              {" "}
              Discover <span className="GradientCircle"></span>
              <br />
              Plant Health <br />
              Instantly
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
        <img
          draggable={false}
          src={clickPhoto}
          className="photo"
          alt="click photo by farmer"
        />
      </div>
    </div>
  );
}
