import { Link } from "react-router-dom";
import "../../styles/sideMenu.css";
import { useEffect, useRef, useState } from "react";

export default function SideMenu({ darkMode, isVisible }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let timer; 
  
    if (containerRef.current) {
      if (isVisible) {
        containerRef.current.style.display = "block";
        containerRef.current.offsetHeight;
        containerRef.current.classList.add("visible");
      } else {
        containerRef.current.classList.remove("visible");
        if (width >= 767) {
          timer = setTimeout(() => {
            if (!isVisible && containerRef.current) {
              containerRef.current.style.display = "none";
            }
          }, 400);
        } else {
          timer = setTimeout(() => {
            if (!isVisible && containerRef.current) {
              containerRef.current.style.display = "none";
            }
          }, 250);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [isVisible, width]);
  

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`${darkMode ? "SideMenu dmode" : "SideMenu"}`}
      ref={containerRef}
    >
      <ul className="SideOptions">
        {width < 960 && (
          <>
            <li>
              <Link to="/diagnose">Daignose Page</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
            <li>
              <Link to="/blogs">Blogs</Link>
            </li>
          </>
        )}

        <li>
          <Link to="/intdb">Interactive DB</Link>
        </li>
        <li>
          <Link to="/insights">Insights</Link>
        </li>

        {width < 960 && (
          <li>
            <Link to="/faq" className={width > 960 ? "deactive" : ""}>
              FAQ & Feedback
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
