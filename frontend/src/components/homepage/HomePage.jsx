import '../../styles/homePage.css';
import AboutUs from './AboutUs.jsx';
import Carousel from './Carousel.jsx';
import EndComps from './EndComps.jsx';
import { useState, useEffect } from 'react';
import LoadingScreen from '../LoadingScreen.jsx';
import WelcomeMessage from '../login_signup/WelcomeMessage.jsx'
import ChatBotImage from '../ChatBot/ChatBotImage.jsx';


function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const userDetails = JSON.parse(sessionStorage.getItem('user'));
  useEffect(() => {
    const loadingTimeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.warn('Loading timeout reached - forcing content display');
      }
    }, 10000);

    return () => clearTimeout(loadingTimeoutId);
  }, [isLoading]);

  useEffect(() => {
    const hasMessageAlreadyShown = JSON.parse(sessionStorage.getItem('welcomeMessageShown'));
    if (!hasMessageAlreadyShown && userDetails) {
      setShowWelcomeMessage(true);
      sessionStorage.setItem('welcomeMessageShown', JSON.stringify(true));
    }
  }, [userDetails]);
  const handleWeatherLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div className='homePageContainer'>
      {showWelcomeMessage && userDetails && <WelcomeMessage uname={userDetails.username} />}
      {isLoading && <LoadingScreen />}
      <div className="contentWrapper" style={{ display: isLoading ? 'none' : 'grid', gap:"43px" }}>
        <AboutUs />
        <ChatBotImage/>
        <Carousel />
        <EndComps onWeatherLoaded={handleWeatherLoaded} />
      </div>
    </div>
  );
}

export default HomePage;