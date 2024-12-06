import React, { useState } from "react";
import {useDarkMode} from './DarkModeContext';
import "../styles/diagnosis.css";
export default function Diagnosis() {
  const{isDarkMode,setDarkMode}=useDarkMode();
  const [image, setImage] = useState(null);
  const [base64data, setBase64data] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set image preview
        setBase64data(reader.result.split(",")[1]); // Extract Base64 data
      };
      reader.readAsDataURL(file);
    }
  };

  // async function handleResponse(){

  //   return response;
  // }

  const handleDetectDisease = async () => {
    if (!base64data) return;
    setLoading(true);
    setPredictions(null);

    try {
      // const response = handleResponse();
      const response = await fetch(
        "https://api-inference.huggingface.co/models/ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: base64data }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setPredictions(result);
    } catch (error) {
      console.error("Error:", error);
      // handleResponse();
      setPredictions([{ label: "Error detecting disease", confidence: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diagnosisContainer" style={isDarkMode?{color:"white",backgroundColor:"#2e302f"}:{color:"black"}}>
      <h3>Diagnose Your Plant</h3>
      <form
        className="uploadOptions"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Label as custom button */}
        <label className="button" htmlFor="file-upload-button">
          Choose Image
        </label>
        <input
          id="file-upload-button"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {image && (
          <div className="finalUpload">
            <img
              src={image}
              alt="Preview"
              style={{ maxHeight: "22vh", marginTop: "10px" }}
            />
            <button
              type="button"
              className="button custom-upload-button"
              onClick={handleDetectDisease}
              disabled={loading}
            >
              {loading ? "Detecting..." : "Detect Disease"}
            </button>
          </div>
        )}
      </form>

      {predictions && (
        <div className="predictions" style={isDarkMode ? { color: "white", backgroundColor: "#242a23" } : { color: "black" }}>
          <h4>Predictions:</h4>
          <div className="diseaseInfoContainer" >
            <p className="metaDname">
              <strong>Disease Name:</strong>
            </p>
            <p className="dname">{predictions[0].label.split("_").join(" ")}</p>
            <p className="metaConf">
              <strong>Confidence:</strong>{" "}
            </p>
            <p className="conf">
            <div className="confidenceParent" style={{width:"200px", backgroundColor:"grey" , borderRadius:"20px"}}>
                  <div className="confidenceindicator" style={{borderRadius:"20px 6px 6px 20px", width: `${(parseFloat((predictions[0].score * 100).toFixed(0)) / 100) * 200}px`,backgroundColor:(predictions[0].score * 100).toFixed(0)>90?" green":(predictions[0].score * 100).toFixed(0)>70?" rgb(252, 211, 3)":" red",textAlign:"center"}}>{(predictions[0].score * 100).toFixed(1)}%</div>
            </div>
            </p>
            
          </div>
        </div>
      )}
    </div>
  );
}
