// import React, { useState } from 'react';
// import './Diagnosis.css';

// const Diagnosis = () => {
//   const [image, setImage] = useState(null);
//   const [result, setResult] = useState('');
//   const [diseaseInfo, setDiseaseInfo] = useState(null);
//   const [preview, setPreview] = useState('');
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [comment, setComment] = useState('');

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!image) {
//       alert('Please upload an image.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('image', image);

//     try {
//       const response = await fetch('http://localhost:5000/api/diagnosis/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       if (data.disease_info) {
//         setResult(`Disease Name: ${data.diagnosis.disease_name}, Confidence Score: ${data.diagnosis.confidence_score}`);
//         setDiseaseInfo(data.disease_info);
//       } else if (data.output) {
//         setResult(data.output);
//       } else {
//         setResult('Failed to classify the image.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred while uploading the image.');
//     }
//   };
  
//   const handleReportSubmit = async () => {
//     if (!comment.trim()) {
//       alert('Please enter a comment.');
//       return;
//     }

//     try {
//       await fetch('http://localhost:5000/api/diagnosis/report', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           diagnosis: diseaseInfo,
//           comment,
//         }),
//       });
//       alert('Report submitted successfully.');
//       setShowReportModal(false);
//     } catch (error) {
//       alert('Failed to submit report.');
//     }
//   };

//   return (
//     <div className="diagnosis-container">
//       <h1>Diagnose Plant Disease</h1>
//       <form onSubmit={handleSubmit}>
//         <input type="file" onChange={handleImageUpload} accept="image/*" required />
//         <button type="submit">Upload and Diagnose</button>
//       </form>
//       {preview && <img src={preview} alt="Uploaded Preview" className="preview-image" />}
//       {result && <div className="result-text">{result}</div>}
//       {diseaseInfo && (
//         <div className="disease-info">
//           <h2>Disease Information</h2>
//           <p><strong>Symptoms:</strong> {diseaseInfo.disease_symptoms}</p>
//           <p><strong>Organic Treatment:</strong> {diseaseInfo.organic_treatment}</p>
//           <p><strong>Inorganic Treatment:</strong> {diseaseInfo.inorganic_treatment}</p>
//           <p><strong>Preventive Measures:</strong> {diseaseInfo.preventive_measure}</p>
//           <p><strong>Conclusion:</strong> {diseaseInfo.conclusion}</p>
//           <button onClick={() => setShowReportModal(true)}>Not satisfied? Report</button>
//         </div>
//       )}
//        {showReportModal && (
//         <div className="modal">
//           <textarea
//             placeholder="Write your comments here..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />
//           <button onClick={handleReportSubmit}>Submit Report</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Diagnosis;
import React, { useState } from 'react';
import './Diagnosis.css';

const Diagnosis = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [preview, setPreview] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [comment, setComment] = useState('');
  const [diagnosisId, setDiagnosisId] = useState(null); // Store diagnosis ID

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/api/diagnosis/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.diagnosisId) {
        setDiagnosisId(data.diagnosisId); // Capture diagnosis ID
      }
      if (data.disease_info) {
        setResult(
          `Disease Name: ${data.diagnosis.disease_name}, Confidence Score: ${data.diagnosis.confidence_score}`
        );
        setDiseaseInfo(data.disease_info);
      } else if (data.output) {
        setResult(data.output);
      } else {
        setResult('Failed to classify the image.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while uploading the image.');
    }
  };

  const handleReportSubmit = async () => {
    if (!comment.trim()) {
      alert('Please enter a comment.');
      return;
    }

    if (!diagnosisId) {
      alert('Diagnosis ID is missing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/diagnosis/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosisId,
          comment,
        }),
      });

      if (response.ok) {
        alert('Report submitted successfully.');
        setShowReportModal(false);
      } else {
        alert('Failed to submit report.');
      }
    } catch (error) {
      alert('Failed to submit report.');
    }
  };

  return (
    <div className="diagnosis-container">
      <h1>Diagnose Plant Disease</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageUpload} accept="image/*" required />
        <button type="submit">Upload and Diagnose</button>
      </form>
      {preview && <img src={preview} alt="Uploaded Preview" className="preview-image" />}
      {result && <div className="result-text">{result}</div>}
      {diseaseInfo && (
        <div className="disease-info">
          <h2>Disease Information</h2>
          <p><strong>Symptoms:</strong> {diseaseInfo.disease_symptoms}</p>
          <p><strong>Organic Treatment:</strong> {diseaseInfo.organic_treatment}</p>
          <p><strong>Inorganic Treatment:</strong> {diseaseInfo.inorganic_treatment}</p>
          <p><strong>Preventive Measures:</strong> {diseaseInfo.preventive_measure}</p>
          <p><strong>Conclusion:</strong> {diseaseInfo.conclusion}</p>
          <button onClick={() => setShowReportModal(true)}>Not satisfied? Report</button>
        </div>
      )}
      {showReportModal && (
        <div className="modal">
          <textarea
            placeholder="Write your comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleReportSubmit}>Submit Report</button>
        </div>
      )}
    </div>
  );
};

export default Diagnosis;
