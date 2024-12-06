// export default Insights;
import React, { useState, useEffect, useRef } from 'react';
import '../styles/analysis.css';
import Chart from 'chart.js/auto';

const Analysis = () => {
  const [activeAnalysis, setActiveAnalysis] = useState('personal');
  const [personalChart, setPersonalChart] = useState(null);
  const [locationChart, setLocationChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // References for user inputs
  const personalTimeFrameRef = useRef('month');
  const locationTimeFrameRef = useRef('month');
  const personalChartTypeRef = useRef('bar');
  const locationChartTypeRef = useRef('bar');
  const userIdRef = useRef('1');
  const locationRef = useRef('');

  // Canvas element refs
  const personalChartRef = useRef(null);
  const locationChartRef = useRef(null);

  useEffect(() => {
    // Load initial personal analysis chart
    updatePersonalChart();

    return () => {
      // Cleanup on component unmount
      if (personalChart) personalChart.destroy();
      if (locationChart) locationChart.destroy();
    };
  }, []); // Run only once when the component mounts
  // useEffect(() => {
  //   // Initial render to load the personal analysis
  //   updatePersonalChart();
  // }, []);

  // useEffect(() => {
  //   // Cleanup on component unmount
  //   return () => {
  //     if (personalChart) personalChart.destroy();
  //     if (locationChart) locationChart.destroy();
  //   };
  // }, [personalChart, locationChart]);

  const fetchData = async (url, callback) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      const data = await response.json();
      callback(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateChart = (chartData, chartType, setChart, chartRef, currentChart) => {
    if (currentChart) currentChart.destroy();
    const ctx = chartRef.current.getContext('2d');
    const newChart = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Plant Disease Analysis' },
        },
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
      },
    });
    setChart(newChart);
  };

  const updatePersonalChart = () => {
    const userId = userIdRef.current.value;
    const timeFrame = personalTimeFrameRef.current.value;
    const chartType = personalChartTypeRef.current.value;

    fetchData(
      `http://localhost:5000/api/analysis/personal?userId=${userId}&timeFrame=${timeFrame}`,
      (data) => createOrUpdateChart(data, chartType, setPersonalChart, personalChartRef, personalChart)
    );
  };

  const updateLocationChart = () => {
    const location = locationRef.current.value;
    const timeFrame = locationTimeFrameRef.current.value;
    const chartType = locationChartTypeRef.current.value;

    fetchData(
      `http://localhost:5000/api/analysis/location?location=${encodeURIComponent(location)}&timeFrame=${timeFrame}`,
      (data) => createOrUpdateChart(data, chartType, setLocationChart, locationChartRef, locationChart)
    );
  };

  return (
    <div className="container">
      <header>
        <h1>Plant Disease Analysis</h1>
        <p>Analyze the occurrence of diseases by month or season.</p>
      </header>

      <div className="analysis-type">
        <button
          className={activeAnalysis === 'personal' ? 'active' : ''}
          onClick={() => {
            setActiveAnalysis('personal');
            updatePersonalChart();
          }}
        >
          Personal Analysis
        </button>
        <button
          className={activeAnalysis === 'location' ? 'active' : ''}
          onClick={() => {
            setActiveAnalysis('location');
            updateLocationChart();
          }}
        >
          Location Analysis
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div id="analysis-content">
        {activeAnalysis === 'personal' && (
          <div id="personal-analysis" className="analysis-section">
            <h2>Personal Analysis</h2>
            <label htmlFor="user-id">Select User:</label>
            <select ref={userIdRef} onChange={updatePersonalChart}>
              <option value="1">User 1</option>
              <option value="4">User 4</option>
              <option value="7">User 7</option>
            </select>

            <label htmlFor="personal-chart-type">Chart Type:</label>
            <select ref={personalChartTypeRef} onChange={updatePersonalChart}>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>

            <label htmlFor="personal-time-frame">Time Frame:</label>
            <select ref={personalTimeFrameRef} onChange={updatePersonalChart}>
              <option value="month">Month</option>
              <option value="season">Season</option>
            </select>
            <div className="chart-container">
              <canvas ref={personalChartRef}></canvas>
            </div>
          </div>
        )}

        {activeAnalysis === 'location' && (
          <div id="location-analysis" className="analysis-section">
            <h2>Location Analysis</h2>
            <label htmlFor="location-select">Select Location:</label>
            <select ref={locationRef} onChange={updateLocationChart}>
              <option value="">Select a location</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="WARANGAL">WARANGAL</option>
            </select>

            <label htmlFor="location-chart-type">Chart Type:</label>
            <select ref={locationChartTypeRef} onChange={updateLocationChart}>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>

            <label htmlFor="location-time-frame">Time Frame:</label>
            <select ref={locationTimeFrameRef} onChange={updateLocationChart}>
              <option value="month">Month</option>
              <option value="season">Season</option>
            </select>
            <div className="chart-container">
              <canvas ref={locationChartRef}></canvas>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
