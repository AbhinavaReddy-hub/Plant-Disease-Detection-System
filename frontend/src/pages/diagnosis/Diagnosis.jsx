import "./Diagnosis.css";
import React, { useState } from "react";

export default function Diagnosis() {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="diagnosisContainer">
      <h1>Vriksha</h1>
      <form
        action=""
        className="uploadOptions"
        onSubmit={(e) => {
          // e.preventDefault();
        }}
      >
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && (
          <div className="finalUpload">
            <img
              src={image}
              alt="Preview"
              style={{ maxWidth: "100px", marginTop: "10px" }}
            />
            <button>Detect Disease</button>
          </div>
        )}
      </form>
    </div>
  );
}
