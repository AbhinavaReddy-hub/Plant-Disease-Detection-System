import { Link } from "react-router-dom";
import "../../styles/sideMenu.css";

export default function SideMenu({ darkMode }) {
  return (
    <div className={`active ${darkMode ? "SideMenu dmode" : "SideMenu"}`}>
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
