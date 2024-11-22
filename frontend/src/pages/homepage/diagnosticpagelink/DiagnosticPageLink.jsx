import './DiagnosticPageLink.css';
import takePhoto from './images/takePhoto.png';
import seeDiagnosis from './images/seeDiagnosis.png';
import remedies from './images/remedies.png';
import { Link } from "react-router-dom";

export default function DiagnosticPageLink(){
    return (
        <div className="diagnosisPageLink">
            <p className='title'>Heal Your Crop</p>
            <div className="heal-your-crop">
                <div className="step">
                    <img src={takePhoto} alt="Take a picture" />
                    <p>Take a picture</p>
                </div>
                <div className="arrow">➜</div>
                <div className="step">
                    <img src={seeDiagnosis} alt="See diagnosis" />
                    <p>See diagnosis</p>
                </div>
                <div className="arrow">➜</div>
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