// export default AgricultureDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import "./WorkSpace.css";

const AgricultureDashboard = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [effect, setEffect] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    // Get the username from session storage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);
  const handleSolveButtonClick = () => {
    navigate("/cases"); // Navigate to the CaseList page
  };
  const handleInputChange = (e) => {
    setComment(e.target.value);

    // Dynamically adjust textarea height
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust to fit content
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file); // Save the file itself
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result); // Create a preview
      reader.readAsDataURL(file);
    }
  };

  const handlePopupSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("username", username.trim().replace(/^"|"$/g, ''));
    formData.append("content", comment);
    formData.append("state", state);
    formData.append("district", district);
    formData.append("effect", effect);
    if (uploadedImage) {
      formData.append("image", uploadedImage);
      console.log(uploadedImage); // Append the file directly
    }
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/notifications/create-and-send-alert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Post submitted successfully!");
        setShowPopup(false);
      } else {
        alert("Error submitting post.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <div className="content">
        <h1 className="project-title">Vriksha Rakshak</h1>

        <div className="cases-section">
          <h3>CASES TO SOLVE: 5 &nbsp;&nbsp;&nbsp;</h3>
          <button className="solve-button" onClick={handleSolveButtonClick}>SOLVE</button>
        </div>

        <div className="total-solved">
          <h3>
            TOTAL CASES SOLVED: 23 <span className="emoji">😊</span>
          </h3>
        </div>

        <div className="report-card">
          <h2>REPORT AN ALERT (Emergency)</h2>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imagePreview && (
            <img src={imagePreview} alt="Uploaded Preview" className="uploaded-image" />
          )}
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Enter Comment"
            value={comment}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              margin: "10px 0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "1rem",
              overflow: "hidden",
              resize: "none",
            }}
          />
          <button className="upload-button" onClick={() => setShowPopup(true)}>
            Upload
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <h5>Choose Location for Alert</h5>
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="" disabled>
              Select State
            </option>
            <option value="TELANGANA">Telangana</option>
            <option value="State2">State 2</option>
            <option value="State3">State 3</option>
          </select>
          <select value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option value="" disabled>
              Select District
            </option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="District2">District 2</option>
          </select>
          <input
            type="number"
            placeholder="Effect (0-10)"
            value={effect}
            onChange={(e) => setEffect(e.target.value)}
            min="0"
            max="10"
          />
          <button onClick={handlePopupSubmit}>Submit</button>
          <button onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AgricultureDashboard;
