// import React, { useState, useEffect, useRef } from 'react';
// import './Analysis.css';
// import Chart from 'chart.js/auto';

// const Analysis = () => {
//   const [activeAnalysis, setActiveAnalysis] = useState('personal');
//   const [personalChart, setPersonalChart] = useState(null);
//   const [locationChart, setLocationChart] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // References for user inputs
//   const personalTimeFrameRef = useRef({ value: 'month' });
//   const locationTimeFrameRef = useRef({ value: 'month' });
//   const personalChartTypeRef = useRef({ value: 'bar' });
//   const locationChartTypeRef = useRef({ value: 'bar' });
//   const userIdRef = useRef(null);
//   const locationRef = useRef('');

//   // Canvas element refs
//   const personalChartRef = useRef(null);
//   const locationChartRef = useRef(null);

//   useEffect(() => {
//     // Fetch userId and location from sessionStorage and set default values
//     const userId = sessionStorage.getItem('userId');
//     const userLocation = sessionStorage.getItem('userLocation');

//     console.log('Fetched userId:', userId);
//     console.log('Fetched userLocation:', userLocation);

//     userIdRef.current = { value: userId };
//     locationRef.current = { value: userLocation };

//     // Update the location dropdown to reflect the default user location
//     if (locationRef.current && locationRef.current.value) {
//       const dropdown = document.getElementById('location-select');
//       if (dropdown) dropdown.value = userLocation;
//     }

//     console.log('Fetched userIdRef:', userIdRef.current.value);
//     console.log('Fetched locationRef:', locationRef.current.value);

//     // Load initial personal and location analysis charts
//     updatePersonalChart();
//     updateLocationChart();

//     return () => {
//       // Cleanup on component unmount
//       if (personalChart) personalChart.destroy();
//       if (locationChart) locationChart.destroy();
//     };
//   }, []);

//   const fetchData = async (url, callback) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(url);
//       if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
//       const data = await response.json();
//       callback(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createOrUpdateChart = (chartData, chartType, setChart, chartRef, currentChart) => {
//     if (currentChart) currentChart.destroy();
//     const ctx = chartRef.current.getContext('2d');
//     const newChart = new Chart(ctx, {
//       type: chartType,
//       data: chartData,
//       options: {
//         responsive: true,
//         plugins: {
//           legend: { position: 'top' },
//           title: { display: true, text: 'Plant Disease Analysis' },
//         },
//         scales: {
//           x: { beginAtZero: true },
//           y: { beginAtZero: true },
//         },
//       },
//     });
//     setChart(newChart);
//   };

//   const updatePersonalChart = () => {
//     const userId = userIdRef.current.value;
//     const timeFrame = personalTimeFrameRef.current.value;
//     const chartType = personalChartTypeRef.current.value;

//     console.log('pLocation for graph:', locationRef.current.value); // Debug log
//     console.log('pTime frame for graph:', timeFrame);
//     console.log('pChart type for graph:', chartType);

//     fetchData(
//       `http://localhost:5000/api/analysis/personal?userId=${userId}&timeFrame=${timeFrame}`,
//       (data) => createOrUpdateChart(data, chartType, setPersonalChart, personalChartRef, personalChart)
//     );
//   };

//   const updateLocationChart = () => {
//     const location = locationRef.current.value;
//     const timeFrame = locationTimeFrameRef.current.value;
//     const chartType = locationChartTypeRef.current.value;

//     console.log('Location for graph:', location); // Debug log
//     console.log('Time frame for graph:', timeFrame);
//     console.log('Chart type for graph:', chartType);

//     fetchData(
//       `http://localhost:5000/api/analysis/location?location=${encodeURIComponent(location)}&timeFrame=${timeFrame}`,
//       (data) => createOrUpdateChart(data, chartType, setLocationChart, locationChartRef, locationChart)
//     );
//   };

//   return (
//     <div className="container">
//       <header>
//         <h1>Plant Disease Analysis</h1>
//         <p>Analyze the occurrence of diseases by month or season.</p>
//       </header>

//       <div className="analysis-type">
//         <button
//           className={activeAnalysis === 'personal' ? 'active' : ''}
//           onClick={() => {
//             setActiveAnalysis('personal');
//             updatePersonalChart();
//           }}
//         >
//           Personal Analysis
//         </button>
//         <button
//           className={activeAnalysis === 'location' ? 'active' : ''}
//           onClick={() => {
//             setActiveAnalysis('location');
//             updateLocationChart();
//           }}
//         >
//           Location Analysis
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p className="error">{error}</p>}

//       <div id="analysis-content">
//         {activeAnalysis === 'personal' && (
//           <div id="personal-analysis" className="analysis-section">
//             <h2>Personal Analysis</h2>
//             <label htmlFor="personal-chart-type">Chart Type:</label>
//             <select ref={personalChartTypeRef} onChange={updatePersonalChart}>
//               <option value="bar">Bar Chart</option>
//               <option value="line">Line Chart</option>
//             </select>

//             <label htmlFor="personal-time-frame">Time Frame:</label>
//             <select ref={personalTimeFrameRef} onChange={updatePersonalChart}>
//               <option value="month">Month</option>
//               <option value="season">Season</option>
//             </select>
//             <div className="chart-container">
//               <canvas ref={personalChartRef}></canvas>
//             </div>
//           </div>
//         )}

//         {activeAnalysis === 'location' && (
//           <div id="location-analysis" className="analysis-section">
//             <h2>Location Analysis</h2>
//             <label htmlFor="location-select">Select Location:</label>
//             <select id="location-select" ref={locationRef} onChange={updateLocationChart}>
//               <option value="Andhra Pradesh">Andhra Pradesh</option>
//               <option value="Telangana">Telangana</option>
//               <option value="WARANGAL">WARANGAL</option>
//             </select>

//             <label htmlFor="location-chart-type">Chart Type:</label>
//             <select ref={locationChartTypeRef} onChange={updateLocationChart}>
//               <option value="bar">Bar Chart</option>
//               <option value="line">Line Chart</option>
//             </select>

//             <label htmlFor="location-time-frame">Time Frame:</label>
//             <select ref={locationTimeFrameRef} onChange={updateLocationChart}>
//               <option value="month">Month</option>
//               <option value="season">Season</option>
//             </select>
//             <div className="chart-container">
//               <canvas ref={locationChartRef}></canvas>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Analysis;
import React, { useState, useEffect, useRef } from 'react';
import './Analysis.css';
import Chart from 'chart.js/auto';

const Analysis = () => {
  const [activeAnalysis, setActiveAnalysis] = useState('personal');
  const [personalChart, setPersonalChart] = useState(null);
  const [locationChart, setLocationChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]); // Array to store dropdown options
  const userLocation = useRef(null); // To store user location from sessionStorage

  // References for user inputs
  const personalTimeFrameRef = useRef({ value: 'month' });
  const locationTimeFrameRef = useRef({ value: 'month' });
  const personalChartTypeRef = useRef({ value: 'bar' });
  const locationChartTypeRef = useRef({ value: 'bar' });
  const userIdRef = useRef(null);
  const locationRef = useRef('');

  // Canvas element refs
  const personalChartRef = useRef(null);
  const locationChartRef = useRef(null);

  useEffect(() => {
    // Fetch userId and location from sessionStorage
    const userId = sessionStorage.getItem('userId');
    const storedUserLocation = sessionStorage.getItem('userLocation') || 'Andhra Pradesh';

    console.log('Fetched userId:', userId);
    console.log('Fetched userLocation:', storedUserLocation);

    userIdRef.current = { value: userId };
    userLocation.current = storedUserLocation;
    locationRef.current = { value: storedUserLocation };

    // Set locations array with user location as the first option
    setLocations([
      storedUserLocation,
      'Andhra Pradesh',
      'Telangana',
      'WARANGAL',
    ]);

    // Load initial personal and location analysis charts
    updatePersonalChart();
    updateLocationChart();

    return () => {
      // Cleanup on component unmount
      if (personalChart) personalChart.destroy();
      if (locationChart) locationChart.destroy();
    };
  }, []);

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

    console.log('pLocation for graph:', locationRef.current.value); // Debug log
    console.log('pTime frame for graph:', timeFrame);
    console.log('pChart type for graph:', chartType);

    fetchData(
      `http://localhost:5000/api/analysis/personal?userId=${userId}&timeFrame=${timeFrame}`,
      (data) => createOrUpdateChart(data, chartType, setPersonalChart, personalChartRef, personalChart)
    );
  };

  const updateLocationChart = () => {
    const location = locationRef.current.value;
    const timeFrame = locationTimeFrameRef.current.value;
    const chartType = locationChartTypeRef.current.value;

    console.log('Location for graph:', location); // Debug log
    console.log('Time frame for graph:', timeFrame);
    console.log('Chart type for graph:', chartType);

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
      {/* {error && <p className="error">{error}</p>} */}

      <div id="analysis-content">
        {activeAnalysis === 'personal' && (
          <div id="personal-analysis" className="analysis-section">
            <h2>Personal Analysis</h2>
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
            <select
              id="location-select"
              ref={locationRef}
              onChange={(e) => {
                locationRef.current.value = e.target.value;
                updateLocationChart();
              }}
            >
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
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
