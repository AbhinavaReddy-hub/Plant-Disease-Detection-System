import "../../styles/homePage.css";
import AboutUs from "./AboutUs.jsx";
import Carousel from "./Carousel.jsx";
import { useState, useEffect } from "react";
import Valid from "../login_signup/WelcomeMessage.jsx";
import Weather from "../Weather.jsx";

function HomePage() {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const userDetails = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const hasMessageAlreadyShown = JSON.parse(
      sessionStorage.getItem("welcomeMessageShown")
    );
    if (!hasMessageAlreadyShown && userDetails) {
      setShowWelcomeMessage(true);
      sessionStorage.setItem("welcomeMessageShown", JSON.stringify(true));
    }
  }, [userDetails]);

  return (
    <div className="homePageContainer">
      {showWelcomeMessage && userDetails && <Valid uname={userDetails.username} />}
      <div className="contentWrapper" style={{ display: "grid", gap: "43px" }}>
        <AboutUs />
        <Carousel />
        <Weather />
      </div>
    </div>
  );
}

export default HomePage;
