import "../styles/diagnosis.css";
import React, { useState } from "react";

export default function Diagnosis() {
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
    <div className="diagnosisContainer">
      <h3>Vriksha Rakshak Diagnosis Page</h3>
      <form
        className="uploadOptions"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Label as custom button */}
        <label
          className="button"
          htmlFor="file-upload-button"
        >
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
        <div className="predictions">
          <h4>Predictions:</h4>
          <table>
            <tr>
              <td><strong>Label:</strong></td>
              <td>{predictions[0].label}</td>
            </tr>
            <tr>
              <td><strong>Confidence:</strong>{" "}</td>
              <td>{(predictions[0].score * 100).toFixed(1)}%</td>
            </tr>
          </table>
        </div>
      )}
    </div>
  );
}
