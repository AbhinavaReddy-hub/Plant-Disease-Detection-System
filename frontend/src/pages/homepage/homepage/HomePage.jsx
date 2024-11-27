import './homepage.css';
import AboutUs from '../aboutus/AboutUs.jsx';
import Carousel from '../carousel/Carousel.jsx';
import EndComps from '../endcomps/EndComps.jsx';
import { useState, useEffect } from 'react';
import LoadingScreen from '../../loadingscreen/LoadingScreen.jsx';
import Valid from '../../Login/validations/valid/Valid.jsx';

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
    <div className='homePage'>
      {showWelcomeMessage && userDetails && <Valid uname={userDetails.username} />}
      {isLoading && <LoadingScreen />}
      <div className="contentWrapper" style={{ display: isLoading ? 'none' : 'grid', gap:"43px" }}>
        <AboutUs />
        <Carousel />
        <EndComps onWeatherLoaded={handleWeatherLoaded} />
      </div>
    </div>
  );
}

export default HomePage;