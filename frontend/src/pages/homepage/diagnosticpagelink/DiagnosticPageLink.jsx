import './DiagnosticPageLink.css';
import takePhoto from './images/takePhoto.png';
import seeDiagnosis from './images/seeDiagnosis.png';
import remedies from './images/remedies.png';
import { useDarkMode } from "../homepage/DarkModeContext" ;
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function DiagnosticPageLink(){
    const {isDarkMode,setdarkmode}=useDarkMode();
    return (
        <div className="diagnosisPageLink">
            <p className='title' style={isDarkMode?{color:"white"}:{color:"black"}}>Heal Your Crop</p>
            <div className="heal-your-crop" style={isDarkMode?{color:"white"}:{color:"black"}}>
                <div className="step">
                    <img src={takePhoto} alt="Take a picture" />
                    <p>Take a picture</p>
                </div>
                <div className="arrow" style={isDarkMode?{color:"white"}:{color:"black"}}>➜</div>
                <div className="step">
                    <img src={seeDiagnosis} alt="See diagnosis" />
                    <p>See diagnosis</p>
                </div>
                <div className="arrow" style={isDarkMode?{color:"white"}:{color:"black"}}>➜</div>
                <div className="step">
                    <img src={remedies} alt="Remedies" />
                    <p>Get medicine</p>
                </div>
            </div>
            <div className="picture-options">
                {/* <form id="uploadimage" action="sandeep/model.html">
                    <input type="submit" id="upload-picture" className="upload-picture-btn" accept="image/*" />
                    <label htmlFor="upload-picture" className="upload-btn-label">Go to Diagnoses page</label>
                </form> */}
                <Link to="/diagnose" className="upload-btn-label">Go to Diagnoses page</Link>
            </div>
            <p id="classified-image"></p>
        </div>
    );
}