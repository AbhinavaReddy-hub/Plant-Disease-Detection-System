import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { useState,useEffect, useRef } from 'react';
import Setting from "../Settings/Setting";
import '../../styles/profileSection.css';
export default function ProfileSection({isVisible ,isSettingClicked,onclose,setSettingClicked}) {
  useEffect(()=>{
    if(isSettingClicked){
      onclose();
    }
  },[isSettingClicked]);
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
      
      <div className="profile-link setting" onClick={()=>{return(setSettingClicked(true))}}>Change Password</div>
      <Link onClick={() => {
        sessionStorage.removeItem('user');
        sessionStorage.setItem('welcomeMessageShown', JSON.stringify(false));
      }
      } className="profile-link signout" to="/">Sign Out</Link>
      {isSettingClicked &&  <Setting onclose={()=>setSettingClicked(false)}/>}
    
    </div>
  
    
  );
}

ProfileSection.propTypes = {
  isVisible: PropTypes.bool
};