import {useDarkMode} from './DarkModeContext';
import React, { useEffect, useState } from "react";
import Camera from "./Camera";
import "../styles/diagnosis.css";

export default function Diagnosis() {
  const{isDarkMode,setDarkMode}=useDarkMode();
  const [image, setImage] = useState(null);
  const [base64data, setBase64data] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState();
  const [takePhotoClicked, setTakePhotoClicked] = useState(false);
  const [cameraPermission, setCameraPermission] = useState();

  const webcamRef = React.useRef(null);

  const turnOffCam = () => {
    setTakePhotoClicked((curr) => !curr)
  }

  const checkCameraPermission = async () => {
    if (!navigator.permissions) {
      console.warn("Permissions API not supported");
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: "camera" });
      setCameraPermission(result.state);

      result.onchange = () => {
        setCameraPermission(result.state);
      };
    } catch (error) {
      console.error("Error checking Camera Permissions:", error);
    }
  };

  const requestCameraAccess = async () => {
    try {
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Camera access granted.");
      setCameraPermission("granted");
      stream.getTracks().forEach((track) => track.stop()); // Stop the camera stream
    } catch (error) {
      console.error("Camera Access Denied:", error);
      setCameraPermission("denied");
    }
  };

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

  const handleCapturedImage = (imageSrc) => {
    setImage(imageSrc);
    setBase64data(imageSrc.split(",")[1]); // Extract Base64 data
    setTakePhotoClicked(false); // Close camera after capture
  };

  const handleDetectDisease = async () => {
    if (!base64data) {
      console.error("No image data available.");
      return;
    }
    setLoading(true);
    setPredictions(null);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: base64data }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error("Invalid response format or no predictions returned.");
      }

      setPredictions(result);
    } catch (error) {
      console.error("Prediction error:", error);
      setPredictions([{ label: "Error detecting disease", score: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(() => window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    checkCameraPermission();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="diagnosisContainer" style={isDarkMode?{color:"white",backgroundColor:"#2e302f"}:{color:"black"}}>
      <h3>Diagnose Your Plant</h3>
      <form
        className="uploadOptions"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="input">
          <label className="button" htmlFor="file-upload-button">
            Choose Image
          </label>
          <input
            id="file-upload-button"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {width <= 768 && (
            <>
              <p className="inputOption">Or</p>
              {cameraPermission === "granted" ? (
                <>
                  <button
                    className="button"
                    onClick={() => setTakePhotoClicked((curr) => !curr)}
                  >
                    {takePhotoClicked ? "Close Camera" : "Take Photo"}
                  </button>
                  {takePhotoClicked && (
                    <Camera 
                      webcamRef={webcamRef} 
                      onCapture={handleCapturedImage}
                      turnOffCam = {turnOffCam}
                    />
                  )}
                </>
              ) : cameraPermission === "denied" ? (
                <p className="error">
                  Camera Access Denied. Please enable camera permission in your
                  browser settings.
                </p>
              ) : (
                <button className="button" onClick={requestCameraAccess}>
                  Enable Camera
                </button>
              )}
            </>
          )}
        </div>
        {image && (
          <div className="finalUpload">
            <img src={image} alt="Preview" />
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