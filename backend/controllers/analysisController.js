const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI ;
let client;

async function connectToDatabase() {
    if (!client || !client.topology?.isConnected()) {
        try {
            client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            console.log("Connected to MongoDB successfully");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw new Error("Database connection failed");
        }
    }
    return client;
}
// Define colors for the datasets
const colors = [
    'rgba(255, 99, 132, 0.2)',   // Red
    'rgba(54, 162, 235, 0.2)',   // Blue
    'rgba(255, 206, 86, 0.2)',   // Yellow
    'rgba(75, 192, 192, 0.2)',   // Green
    'rgba(153, 102, 255, 0.2)',  // Purple
    'rgba(255, 159, 64, 0.2)',   // Orange
    'rgba(201, 203, 207, 0.2)'   // Grey
  ];
  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(201, 203, 207, 1)'
  ];
async function fetchPersonalAnalysisData(userId, timeFrame) {
  try {
    const client = await connectToDatabase();
    const db = client.db("plant_disease_detection");
    const collection = db.collection("PersonalAnalysis");

    console.log(`Fetching data for user: ${userId} and timeFrame: ${timeFrame}`);
    const data = await collection.findOne({ "_id.user_id": userId });

    if (!data) throw new Error(`No data found for user ${userId}`);

    const summary = data.summary;
    const diseaseData = {};
    const months = new Set();
   summary.forEach(item => {
    const month = item.month;  
    item.disease_counts.forEach(disease => {
      const { disease_name, count } = disease;
  
      if (!diseaseData[disease_name]) diseaseData[disease_name] = {};
      if (!diseaseData[disease_name][month]) diseaseData[disease_name][month] = 0;
  
      diseaseData[disease_name][month] += parseInt(count.$numberLong || count || 0, 10);
      months.add(month);
    });
  });
  

    const sortedMonths = Array.from(months).sort((a, b) =>
      new Date(`1 ${a} 2024`) - new Date(`1 ${b} 2024`)
    );
    if (timeFrame === 'season') {
      console.log("Converting monthly data to seasonal format...");
      const seasonalData = convertToSeasonalDatauser(summary);
    
      if (!seasonalData.labels || !seasonalData.datasets) {
        throw new Error("convertToSeasonalDatauser did not return the expected structure");
      }
    
      return seasonalData;
    }
    else {
    console.log("Processing monthly data...");
    const datasets = Object.keys(diseaseData).map((diseaseName, index) => ({
      label: diseaseName,
      data: sortedMonths.map(month => diseaseData[diseaseName][month] || 0),
      backgroundColor: colors[index % colors.length],
      borderColor: borderColors[index % borderColors.length],
      borderWidth: 1,
    }));
    return { labels: sortedMonths, datasets: datasets };
  }
  } catch (error) {
    console.error("Error in fetchPersonalAnalysisData:", error);
    throw error;
  }
}

async function fetchLocationDataFromDB(location, timeFrame) {
  try {
    const client = await connectToDatabase();
    const db = client.db("plant_disease_detection");
    const collection = db.collection("LocationAnalysis");
    console.log(`Fetching data for location: ${location} and timeFrame: ${timeFrame}`);

    const data = await collection.findOne({ "_id.location": location });
    if (!data) throw new Error(`No data found for ${location}`);

    const summary = data.summary;
    const diseaseData = {};
    const months = new Set();

    summary.forEach(item => {
      const month = item.month;
      const diseaseName = item.disease_counts.disease_name;
      const count = item.disease_counts.count;

      if (!diseaseData[diseaseName]) diseaseData[diseaseName] = {};
      if (!diseaseData[diseaseName][month]) diseaseData[diseaseName][month] = 0;
      diseaseData[diseaseName][month] += count;
      months.add(month);
    });

    const sortedMonths = Array.from(months).sort((a, b) =>
      new Date(`1 ${a} 2024`) - new Date(`1 ${b} 2024`)
    );
    
    if (timeFrame === 'season') {
      console.log("Converting monthly data to seasonal format...");
      const seasonalData = convertToSeasonalData(summary);
      if (!seasonalData.labels || !seasonalData.datasets) {
        throw new Error("convertToSeasonalData did not return the expected structure");
      }

      return seasonalData; // Ensure seasonalData is returned as an object with labels and datasets
    } else {
      console.log("Processing monthly data...");
      const datasets = Object.keys(diseaseData).map((diseaseName, index) => ({
        label: diseaseName,
        data: sortedMonths.map(month => diseaseData[diseaseName][month] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: borderColors[index % borderColors.length],
        borderWidth: 1,
      }));

      return { labels: sortedMonths, datasets: datasets };
    }
  } catch (error) {
    console.error("Error in fetchLocationDataFromDB:", error);
    throw error;
  }
}

function convertToSeasonalData(monthlyData) {
    try {
        const seasons = {
            Kharif: ['June', 'July', 'August', 'September', 'October'],
            Rabi: ['November', 'December', 'January', 'February', 'March'],
            Zaid: ['April', 'May']
          };
          
          
            // Initialize seasonal data structure
            const seasonalData = {
              labels: Object.keys(seasons),
              datasets: []
            };
          
            // Create a map to accumulate disease counts by season and disease name
            const seasonalCounts = {};
          
            monthlyData.forEach(item => {
              const { month, disease_counts } = item;
              let seasonName = null;
          
              // Determine the season based on the month
              for (const [season, months] of Object.entries(seasons)) {
                if (months.includes(month)) {
                  seasonName = season;
                  break;
                }
              }
          
              // Initialize the season in the map if it doesn't exist
              if (!seasonalCounts[seasonName]) {
                seasonalCounts[seasonName] = {};
              }
          
              // Accumulate counts by disease name
              if (seasonName) {
                const { disease_name, count } = disease_counts;
                if (!seasonalCounts[seasonName][disease_name]) {
                  seasonalCounts[seasonName][disease_name] = 0;
                }
                seasonalCounts[seasonName][disease_name] += count;
              }
            });
          
            // Convert accumulated seasonal data into the datasets format for the chart
            for (const [season, diseases] of Object.entries(seasonalCounts)) {
              for (const [disease_name, count] of Object.entries(diseases)) {
                seasonalData.datasets.push({
                  label: disease_name,
                  data: Object.keys(seasons).map(s => (s === season ? count : 0))
                });
              }
            }
          
            return seasonalData;
    } catch (error) {
        console.error("Error converting data to seasonal:", error);
        throw error;
    }
}


function convertToSeasonalDatauser(monthlyData) {
  // Define Indian agricultural seasons based on months
  const seasons = {
    Kharif: ['June', 'July', 'August', 'September', 'October'],
    Rabi: ['November', 'December', 'January', 'February', 'March'],
    Zaid: ['April', 'May']
  };

  // Initialize the seasonal data structure
  const seasonalData = {
    labels: Object.keys(seasons),
    datasets: []
  };

  // Create a map to store counts by season and disease name
  const seasonalCounts = {};

  monthlyData.forEach(item => {
    const { month, disease_counts } = item;
    let seasonName = null;

    // Determine the season based on the month
    for (const [season, months] of Object.entries(seasons)) {
      if (months.includes(month)) {
        seasonName = season;
        break;
      }
    }

    if (seasonName) {
      // Initialize season entry if it doesn't exist
      if (!seasonalCounts[seasonName]) {
        seasonalCounts[seasonName] = {};
      }

      // Accumulate counts for each disease
      disease_counts.forEach(disease => {
        const { disease_name, count } = disease;
        if (!seasonalCounts[seasonName][disease_name]) {
          seasonalCounts[seasonName][disease_name] = 0;
        }
        seasonalCounts[seasonName][disease_name] += parseInt(count.$numberLong || count || 0, 10);
      });
    }
  });

  // Convert seasonal counts into the datasets format
  for (const [season, diseases] of Object.entries(seasonalCounts)) {
    for (const [disease_name, count] of Object.entries(diseases)) {
      seasonalData.datasets.push({
        label: disease_name,
        data: Object.keys(seasons).map(s => (s === season ? count : 0)),
      });
    }
  }

  return seasonalData;
}

module.exports = { fetchPersonalAnalysisData, fetchLocationDataFromDB };
