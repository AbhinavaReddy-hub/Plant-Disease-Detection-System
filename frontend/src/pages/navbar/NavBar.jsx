import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import profilePic from "../../icons/pp.png";
import ProfileSection from "./profilesection/ProfileSection";
import notifOff from "./notifOff.svg";
import notifOn from "./notifOn.svg";
import SideMenu from "./SideMenu/SideMenu";
import { RiMenu2Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import NotifDetails from "./notifDetails/NotifDetails";
import "./NavBar.css";
import darkmode from "../../icons/modes/darkmode.svg";
import lightmode from "../../icons/modes/lightmode.svg";

export default function NavBar() {
  // JSON.parse(JSON.parse(localStorage.getItem('isDark'))
  const [isDarkMode, setDarkMode] = useState(false);
  const [isProfileClick, setIsProfileClick] = useState(false);
  const [isNotifClick, setIsNotifClick] = useState(false);
  const [notif, setNotif] = useState(true);
  const [isMenuClicked, setMenuClicked] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  useEffect(() => {
    if (document.readyState === "complete") {
      if (isDarkMode === true) {
        document.body.style.backgroundColor = ' #242c24';
        document.body.style.color='white';
        document.querySelector(".navWraper header").style.backgroundColor  ='#1e251e';
        document.querySelector(".aboutUs .lc").style.color='white';
        document.querySelectorAll(".diagnosisPageLink .arrow")[0].style.color="white";
        document.querySelectorAll(".diagnosisPageLink .arrow")[1].style.color="white";
        document.querySelector(".weatherContainer").style.backgroundColor="#242a23";
        document.querySelector(".weatherContainer .weatherDetail").style.color="white";
        document.querySelector("footer").style.backgroundColor="#1e251e";
      } else {
        document.body.style.backgroundColor = "#f9fef9";
        document.body.style.color = "black";
        document.querySelector(".navWraper header").style.backgroundColor =
          "rgb(14,188,14)";
        document.querySelector(".aboutUs .lc").style.color = "black";
        document.querySelectorAll(".diagnosisPageLink .arrow")[0].style.color =
          "black";
        document.querySelectorAll(".diagnosisPageLink .arrow")[1].style.color =
          "black";
        if (document.querySelector(".weatherContainer")) {
          document.querySelector(".weatherContainer").style.backgroundColor =
            "rgb(212, 206, 206)";
          document.querySelector(
            ".weatherContainer .weatherDetail"
          ).style.color = "black";
        }
        document.querySelector("footer").style.backgroundColor = "#185d1a";
      }
      // localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    }
  }, [isDarkMode]);
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
      <header>
        <nav>
          {screenSize <= 1200 &&
            (isMenuClicked ? (
              <RxCross2
                className={isDarkMode ? "sidemenuDark" : "SideMenuBar"}
                onClick={handleMenubarClick}
              />
            ) : (
              <RiMenu2Fill
                className={isDarkMode ? "sidemenuDark" : "SideMenuBar"}
                onClick={handleMenubarClick}
              />
            ))}
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
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/feedback">Feedback</Link>
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
                className="modebutton"
                onClick={() => {
                  setDarkMode((cur) => !cur);
                }}
              >
                {isDarkMode ? (
                  <img src={darkmode} type="svg" title="light mode" />
                ) : (
                  <img src={lightmode} type="svg" title="dark mode" />
                )}
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
