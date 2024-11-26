import './Footer.css'
import { useDarkMode } from '../homepage/homepage/DarkModeContext';

export default function Footer(){
    const {isDarkMode,setDarkmode}=useDarkMode();
    return (
        <footer style={isDarkMode?{color:"white",backgroundColor:"#1e251e"}:{color:"black"}}>
            <div className="mainFooter">
                <div className='contact'>
                    <span>Contact Us: </span>
                    <span>abhinav@gmail.com</span>
                </div>
                <div className='version'>
                    Version 1.0
                </div>
                <div className='copyright'>
                   © 2024 VirkshaRakshak. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}