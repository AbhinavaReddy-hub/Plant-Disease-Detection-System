import { useDarkMode } from '../../DarkModeContext';
import './loadingScreen.css';


export default function LoadingScreen(){
    const {isDarkMode,setDarkMode}=useDarkMode();
    return (
        <div className='loadingContainer'>    
            <svg className='loading' viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    )
}