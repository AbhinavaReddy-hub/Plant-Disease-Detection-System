import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import profilePic from "../../images/icons/profile.png";
import ProfileSection from "./ProfileSection";
import notifOff from "../../images/notification/notifOff.svg";
import notifOn from "../../images/notification/notifOn.svg";
import { useDarkMode } from "../DarkModeContext";
import SideMenu from "./SideMenu";
import { RiMenu2Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import NotifDetails from "./NotifDetails";
import darkmode from "../../images/icons/modes/darkmode2.svg";
import lightmode from "../../images/icons/modes/lightmode.svg";
import ham_dark from '../../images/icons/hamburgerIcon/dark.svg';
import ham_light from '../../images/icons/hamburgerIcon/light.svg';
import cross_dark from '../../images/icons/cross/dark.svg';
import cross_light from '../../images/icons/cross/light.svg';
import "../../styles/navBar.css";

export default function NavBar() {
  const { isDarkMode, setDarkMode } = useDarkMode();
  const [isProfileClick, setIsProfileClick] = useState(false);
  const [isNotifClick, setIsNotifClick] = useState(false);
  const [notif, setNotif] = useState(true);
  const [isMenuClicked, setMenuClicked] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [screenSize]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New disease spreading in your area",
      desc: "7 new tomato leaf blight diseases have been diagnosed in Warangal",
    },
    {
      id: 2,
      title: "New disease spreading in your area",
      desc: "7 new tomato leaf blight diseases have been diagnosed in Warangal",
    },
    {
      id: 3,
      title: "New disease spreading in your area",
      desc: "7 new tomato leaf blight diseases have been diagnosed in Warangal",
    },
    {
      id: 4,
      title: "New disease spreading in your area",
      desc: "7 new tomato leaf blight diseases have been diagnosed in Warangal",
    },
  ]);

  const handleClickOutside = useCallback((event) => {
    if (
      !event.target.closest(".dropdown-menu") &&
      !event.target.closest(".pp")
    ) {
      // setIsNotifClick(false);
      setIsProfileClick(false);
      setMenuClicked(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleNotifClick = (e) => {
    e.stopPropagation();
    setIsProfileClick(false);
    setMenuClicked(false);
    setIsNotifClick((prev) => !prev);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setIsNotifClick(false);
    setMenuClicked(false);
    setIsProfileClick((prev) => !prev);
  };
  const handleMenubarClick = (e) => {
    e.stopPropagation();
    setIsNotifClick(false);
    setIsProfileClick(false);
    setMenuClicked((cur) => !cur);
  };
  return (
    <div className="navWraper">
      <header style={isDarkMode ? { backgroundColor: "#1e251e" } : {}}>
        <nav>
          {screenSize <= 1200 && (
            <button
              className="menu"
            >
              {isDarkMode ? (
                <img src={cross_light}
                className={`side-menu ${isMenuClicked ? "active" : ""}`}
                alt="side-menu"
                onClick={handleMenubarClick} />
              ) : (
                <img src = {cross_dark} 
                className={`side-menu ${isMenuClicked ? "active" : ""}`}
                alt = "side-menu"
                onClick={handleMenubarClick} />
              )}

              {isDarkMode ? (
                <img src={ham_light}
                className={`side-menu ${!isMenuClicked ? "active" : ""}`}
                alt="side-menu"
                onClick={handleMenubarClick} />
              ) : (
                <img src = {ham_dark} 
                className={`side-menu ${!isMenuClicked ? "active" : ""}`} 
                alt = "side-menu"
                onClick={handleMenubarClick} />
              )}
            </button>
          )}
          <Link className="title" to="/home">
            Vriksha Rakshak
          </Link>
          <div className="options">
            <ul className={screenSize <= 1200 ? "deactive" : " "}>
              <li>
                <Link to="/diagnose">Diagnose</Link>
              </li>
              <li>
                <Link to="/history">History</Link>
              </li>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li>
                <Link to="/intdb">Interactive DB</Link>
              </li>
              <li>
                <Link to="/insights">Insights</Link>
              </li>
              <li>
                <Link to="/Faq">FAQ & Feedback</Link>
              </li>
            </ul>

            <div className="extraOptions">
              <img
                className={`notif ${isNotifClick ? "active" : ""}`}
                src={notif ? notifOn : notifOff}
                alt={notif ? "New Notifications" : "No notifications"}
                onClick={handleNotifClick}
              />

              <img
                className={`pp ${isProfileClick ? "active" : ""}`}
                src={profilePic}
                alt="profile"
                onClick={handleProfileClick}
              />
              <button
                className="modebutton tooltip"
                data-tooltip={isDarkMode ? "Dark Mode" : "Light Mode"}
                onClick={() => {
                  setDarkMode((cur) => !cur);
                }}
              >
                <img
                  src={darkmode}
                  alt="Dark Mode"
                  className={isDarkMode ? "active" : ""}
                />
                <img
                  src={lightmode}
                  alt="Light Mode"
                  className={!isDarkMode ? "active" : ""}
                />
              </button>
            </div>
          </div>
        </nav>
        <NotifDetails
          notifications={notifications}
          setNotifications={setNotifications}
          isVisible={isNotifClick}
        />
        <ProfileSection isVisible={isProfileClick} />
      </header>
      {screenSize <= 1200 && isMenuClicked && (
        <SideMenu darkMode={isDarkMode} />
      )}
    </div>
  );
}
