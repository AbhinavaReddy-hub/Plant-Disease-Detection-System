import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import History from "./History";

export default function SendHistory() {
  const [history, setHistory] = useState([]);
  const [diagnosisCount, setDiagnosisCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Get the user ID from sessionStorage
        const userId = sessionStorage.getItem("userId");

        // If userId is not found, handle it (optional)
        if (!userId) {
          throw new Error("User ID not found in session storage");
        }

        // Fetch history data using the user ID
        const response = await fetch(`http://${LOCAL_IP}:5000/api/history?userId=${userId}`);
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and set history data
        const data = await response.json();
        setHistory(data.diagnoses);
        setDiagnosisCount(data.diagnoses.length);
      } catch (err) {
        console.error("Error fetching history data:", err);
        setError(err.message);
      }
    };

    fetchHistory();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="SendHistoryWrapper"
    >
      <section className="headerAndGotoInsights">
        <h2>History</h2>
        <Link to="/insights" className="button">
          Check out Your Insights
        </Link>
      </section>
      <section
        className="containingDetails"
      >
        <div
          className="monthSectioinAndCount"
        >
          <h3 style={{ fontSize: "20px" }}>Current Month</h3>
          <button>
            Diagnosis Count:{" "}
            <span
              style={{
                color: "blue",
                fontWeight: "bolder",
                fontSize: "18px",
              }}
            >
              {diagnosisCount}
            </span>
          </button>
        </div>
        {history.map(
          (
            { diagnosis_date, disease_name, confidence_score, image_url, location_detected, reported },
            index
          ) => (
            <div key={index}>
              <History
                disease={disease_name}
                percentage={`${(confidence_score * 100).toFixed(0)}%`}
                date={diagnosis_date}
                leaf={image_url}
                location={location_detected}
              />
              <p
                style={{
                  color: reported ? "red" : "green",
                  fontWeight: "bold",
                }}
              >
                {reported ? "Reported": "Solved"}
              </p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
