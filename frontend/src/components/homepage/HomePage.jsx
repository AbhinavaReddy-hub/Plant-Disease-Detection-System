import AboutUs from "./AboutUs.jsx";
import Carousel from "./Carousel.jsx";
import { useState, useEffect } from "react";
import Weather from "../Weather.jsx";
import WelcomeMessage from '../login_signup/WelcomeMessage.jsx'
import ChatBotImage from '../ChatBot/ChatBotImage.jsx';
import GoogleTranslateWidget from "../GoogleTranslateWidget.jsx";
import '../../styles/homePage.css';

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
      {showWelcomeMessage && userDetails && <WelcomeMessage uname={userDetails.username} />}
      <div className="contentWrapper" style={{ display: "grid", gap: "43px" }}>
        <GoogleTranslateWidget/>
        <AboutUs />
        <ChatBotImage/>
        <Carousel />
        <Weather />
      </div>
    </div>
  );
}

export default HomePage;