import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDarkMode } from "../../DarkModeContext";
import profilePic from "../../icons/pp.png";
import ProfileSection from "./profilesection/ProfileSection";
import notifOff from "./notifOff.svg";
import notifOn from "./notifOn.svg";
import SideMenu from "./SideMenu/SideMenu";
import NotifDetails from "./notifDetails/NotifDetails";
import ham_dark from "./hamburgerIcon/dark.svg";
import ham_light from "./hamburgerIcon/light.svg";
import cross_dark from "./cross/dark.svg";
import cross_light from "./cross/light.svg";
import lightmode from "./modes/lightmode.svg";
import darkmode from "./modes/darkmode2.svg";
import "./NavBar.css";

export default function NavBar() {
  const { isDarkMode, setDarkMode } = useDarkMode();
  const [username, setUsername] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).user_type
      : ""
  );
  const [isProfileClick, setIsProfileClick] = useState(false);
  const [isNotifClick, setIsNotifClick] = useState(false);
  const [notif, setNotif] = useState(true);
  const [isMenuClicked, setMenuClicked] = useState(false);
  const [isSettingClicked, setSettingClicked] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [allViewed, setAllViewed] = useState(false);

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
      <header className={`${isDarkMode ? "dmode" : ""}`}>
        <nav>
          <button className="menu">
            {isDarkMode ? (
              <img
                src={cross_light}
                draggable="false"
                className={`side-menu ${isMenuClicked ? "active" : ""}`}
                alt="side-menu"
                onClick={handleMenubarClick}
              />
            ) : (
              <img
                src={cross_dark}
                draggable="false"
                className={`side-menu ${isMenuClicked ? "active" : ""}`}
                alt="side-menu"
                onClick={handleMenubarClick}
              />
            )}

            {isDarkMode ? (
              <img
                src={ham_light}
                draggable="false"
                className={`side-menu ${!isMenuClicked ? "active" : ""}`}
                alt="side-menu"
                onClick={handleMenubarClick}
              />
            ) : (
              <img
                src={ham_dark}
                draggable="false"
                className={`side-menu ${!isMenuClicked ? "active" : ""}`}
                alt="side-menu"
                onClick={handleMenubarClick}
              />
            )}
          </button>
          <Link className="title" to="/home">
            Vriksha Rakshak
          </Link>
          <div className="options">
            {screenSize >= 960 && (
              <ul>
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
                  <Link to="/insights">Insights</Link>
                </li>
                <li>
                  {username === "admin" && (
                    <li>
                      <Link to="/workspace">WorkSpace</Link>
                    </li>
                  )}
                </li>
              </ul>
            )}

            <div className="extraOptions">
              <img
                draggable="false"
                className={`notif ${isNotifClick ? "active" : ""}`}
                src={!allViewed ? notifOn : notifOff}
                alt={!allViewed ? "New Notifications" : "No notifications"}
                onClick={handleNotifClick}
              />

              <img
                draggable="false"
                className={`pp ${isProfileClick ? "active" : ""}`}
                src={profilePic}
                alt="profile"
                onClick={handleProfileClick}
              />
              <button
                draggable="false"
                className="modebutton tooltip"
                data-tooltip={isDarkMode ? "Dark Mode" : "Light Mode"}
                onClick={() => {
                  setDarkMode((cur) => !cur);
                }}
              >
                <img
                  draggable="false"
                  src={darkmode}
                  alt="Dark Mode"
                  className={isDarkMode ? "active" : ""}
                />
                <img
                  draggable="false"
                  src={lightmode}
                  alt="Light Mode"
                  className={!isDarkMode ? "active" : ""}
                />
              </button>
            </div>
          </div>
        </nav>
        <NotifDetails
          allViewed={allViewed}
          setAllViewed={() => setAllViewed(true)}
          notifications={notifications}
          setNotifications={setNotifications}
          isVisible={isNotifClick}
        />
        <ProfileSection
          isVisible={isProfileClick}
          isSettingClicked={isSettingClicked}
          onclose={() => setIsProfileClick(false)}
          setSettingClicked={setSettingClicked}
        />
      </header>
      <SideMenu darkMode={isDarkMode} isVisible={isMenuClicked} />
    </div>
  );
}
