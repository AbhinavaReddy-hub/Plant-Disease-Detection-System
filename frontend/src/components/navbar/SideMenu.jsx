import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "../../styles/sideMenu.css";
export default function SideMenu({ darkMode, isVisible }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      if (isVisible) {
        containerRef.current.style.display = 'block';
        containerRef.current.offsetHeight;
        containerRef.current.classList.add('visible');
      } else {
        containerRef.current.classList.remove("visible");
        const timer = setTimeout(() => {
          if (!isVisible && containerRef.current) {
            containerRef.current.style.display = "none";
          }
        }, 250); // Match with CSS transition duration
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible]);

  return (
    <div
      className={`${darkMode ? "SideMenu dmode" : "SideMenu"}`}
      ref={containerRef}
    >
      <ul className="SideOptions">
        <li>
          <Link to="/diagnose">Daignose Page</Link>
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
          <Link to="/faq">FAQ & Feedback</Link>
        </li>
      </ul>
    </div>
  );
}
