import { useState, useEffect } from "react";
import AboutUs from "../aboutus/AboutUs.jsx";
import Carousel from "../carousel/Carousel.jsx";
import Weather from "../weather/Weather.jsx";
import Valid from "../../Login/validations/valid/Valid.jsx";
import ChatBotImage from "../../ChatBot/ChatBotImage.jsx";
import GoogleTranslateWidget from "../../GoogleTranslateWidget.jsx";
import "./homepage.css";

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
      {showWelcomeMessage && userDetails && (
        <Valid uname={userDetails} />
      )}
      <div className="contentWrapper" style={{ display: "grid", gap: "43px" }}>
        <GoogleTranslateWidget />
        <AboutUs />
        <ChatBotImage />
        <Carousel />
        <Weather />
      </div>
    </div>
  );
}

export default HomePage;