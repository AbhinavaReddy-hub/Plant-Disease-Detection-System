
import './SideMenu.css';
import { Link } from 'react-router-dom';

export default function SideMenu({darkMode}){

    return (
        <div className={darkMode?"SideMenu dmode":"SideMenu"}>
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