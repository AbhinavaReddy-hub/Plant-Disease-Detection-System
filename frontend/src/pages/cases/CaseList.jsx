// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './CaseList.css';

// const CaseList = () => {
//   const [groupedReports, setGroupedReports] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [expandedDate, setExpandedDate] = useState(null);

//   // Fetch grouped reports
//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:5000/api/solve/cases`);
//       setGroupedReports(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   // Toggle reports for a specific date
//   const toggleReports = (date) => {
//     setExpandedDate(expandedDate === date ? null : date);
//   };

//   const formatDate = (date) => {
//     const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
//     return new Date(date).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div className="case-list-container">
//       <h1>Unsolved Reports by Date</h1>
//       {loading ? (
//         <div className="loading-spinner">
//           <div></div>
//         </div>
//       ) : (
//         <div className="case-date-list">
//           {groupedReports.length === 0 ? (
//             <p>No unsolved reports available.</p>
//           ) : (
//             groupedReports.map((group) => (
//               <div key={group._id} className="date-group">
//                 <div className="date-header" onClick={() => toggleReports(group._id)}>
//                   <h3>{formatDate(group._id)}</h3>
//                   <p>Reports Count: {group.count}</p>
//                   <button className="toggle-button">
//                     {expandedDate === group._id ? 'Hide Reports' : 'Check Reports'}
//                   </button>
//                 </div>
//                 {expandedDate === group._id && (
//                   <div className="case-cards">
//                     {group.reports.map((report) => (
//                       <div key={report._id} className="case-card">
//                         <div className="case-info">
//                           <div className="case-details">
//                             <h3>Report ID: {report._id.substring(0, 6)}</h3>
//                             <p>
//                               <strong>Comment:</strong> {report.comment || 'No comment'}
//                             </p>
//                             <p>
//                               <strong>Created At:</strong> {formatDate(report.createdAt)}
//                             </p>
//                             <button className="solve-button">
//                               Solve Report
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CaseList;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import './CaseList.css';

const CaseList = () => {
  const [groupedReports, setGroupedReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedDate, setExpandedDate] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch grouped reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/solve/cases`);
      setGroupedReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Toggle reports for a specific date
  const toggleReports = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Navigate to Solve Diagnosis Page
  const handleSolveReport = (reportId) => {
    navigate(`/solve/${reportId}`); // Navigate to the solve page with the report ID
  };

  return (
    <div className="case-list-container">
      <h1>Unsolved Reports by Date</h1>
      {loading ? (
        <div className="loading-spinner">
          <div></div>
        </div>
      ) : (
        <div className="case-date-list">
          {groupedReports.length === 0 ? (
            <p>No unsolved reports available.</p>
          ) : (
            groupedReports.map((group) => (
              <div key={group._id} className="date-group">
                <div className="date-header" onClick={() => toggleReports(group._id)}>
                  <h3>{formatDate(group._id)}</h3>
                  <p>Reports Count: {group.count}</p>
                  <button className="toggle-button">
                    {expandedDate === group._id ? 'Hide Reports' : 'Check Reports'}
                  </button>
                </div>
                {expandedDate === group._id && (
                  <div className="case-cards">
                    {group.reports.map((report) => (
                      <div key={report._id} className="case-card">
                        <div className="case-info">
                          <div className="case-details">
                            <h3>Report ID: {report._id.substring(0, 6)}</h3>
                            <p>
                              <strong>Comment:</strong> {report.comment || 'No comment'}
                            </p>
                            <p>
                              <strong>Created At:</strong> {formatDate(report.createdAt)}
                            </p>
                            <button
                              className="solve-button"
                              onClick={() => handleSolveReport(report._id)} // Pass the report ID to navigate
                            >
                              Solve Report
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CaseList;
