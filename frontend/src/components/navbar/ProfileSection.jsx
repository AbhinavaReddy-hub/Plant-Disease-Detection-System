import { Link } from "react-router-dom";
import '../../styles/profileSection.css';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export default function ProfileSection({ isVisible }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      if (isVisible) {
        containerRef.current.style.display = 'flex';
        containerRef.current.offsetHeight;
        containerRef.current.classList.add('visible');
      } else {
        containerRef.current.classList.remove('visible');
        const timer = setTimeout(() => {
          if (!isVisible && containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible]);

  return (
    <div className="profileSection dropdown-menu" ref={containerRef}>
      <Link className="profile-link setting" to="/setting">Setting</Link>
      <Link onClick={() => {
        sessionStorage.removeItem('user');
        sessionStorage.setItem('welcomeMessageShown', JSON.stringify(false));
      }
      } className="profile-link signout" to="/">Sign Out</Link>
    </div>
  );
}

ProfileSection.propTypes = {
  isVisible: PropTypes.bool
};