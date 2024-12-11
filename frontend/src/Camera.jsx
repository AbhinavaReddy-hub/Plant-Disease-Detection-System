import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from "react-dom";
import Webcam from "react-webcam";
import './camera.css';
import goBack from './images/icons/cross/light.svg';

const Camera = ({ webcamRef, onCapture, turnOffCam }) => {
  const [mounted, setMounted] = useState(false);
  const localWebcamRef = useRef(null);

  // Determine optimal aspect ratio based on device
  const getOptimalAspectRatio = () => {
    const isMobile = window.innerWidth <= 768;
    
    // For mobile devices, prefer 9:16 portrait mode
    if (isMobile) {
      return 9 / 16;
    }
    
    // For desktop, use standard 16:9 landscape
    return 16 / 9;
  };

  // Dynamic video constraints
  const videoConstraints = {
    aspectRatio: getOptimalAspectRatio(),
    facingMode: { ideal: "environment" }
  };

  useEffect(() => {
    setMounted(true);

    // Attempt to get camera permissions on mount
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            aspectRatio: getOptimalAspectRatio()
          } 
        });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Camera permission error:", err);
      }
    };

    getCameraPermission();
  }, []);

  const handleCapture = useCallback(() => {
    const currentRef = webcamRef?.current || localWebcamRef.current;
    if (currentRef) {
      // Capture with optimized settings
      const imageSrc = currentRef.getScreenshot();
      
      if (imageSrc) {
        console.log("Screenshot captured successfully");
        if (onCapture) {
          onCapture(imageSrc);
        }
      } else {
        console.error("Failed to capture screenshot");
      }
    }
  }, [webcamRef, onCapture]);

  if (!mounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="camera-container">
      <button className='goBack' onClick={turnOffCam}><img src={goBack} alt="Go Back" /></button>
      <Webcam
        audio={false}
        ref={webcamRef || localWebcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        width="100%"
        height="100%"
        className="cam"
        mirrored={false}
      />
      <button 
        className="capture-button" 
        onClick={handleCapture}
      >
        Capture
      </button>
    </div>,
    document.getElementById("cameraPortal")
  );
};

export default Camera;