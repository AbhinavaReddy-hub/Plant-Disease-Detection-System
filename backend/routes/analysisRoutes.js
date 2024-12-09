const express = require("express");
const router = express.Router();
const { fetchPersonalAnalysisData, fetchLocationDataFromDB, fetchUserHistory } = require("../controllers/analysisController");

// Route for personal analysis
router.get("/personal", async (req, res) => {
    try {
        // const userId = parseInt(req.query.userId, 10) || 4;
        const userId = parseInt(req.query.userId, 10);

        
        const timeFrame = req.query.timeFrame || "month";
        const data = await fetchPersonalAnalysisData(userId, timeFrame);
        res.json(data);
    } catch (error) {
        console.error("Error fetching personal analysis data:", error);
        res.status(500).json({ message: "Error fetching personal analysis data", error: error.message });
    }
});

// Route for location-based analysis
router.get("/location", async (req, res) => {
    try {
        const location = req.query.location || "Andhra Pradesh";
        const timeFrame = req.query.timeFrame || "month";
        const data = await fetchLocationDataFromDB(location, timeFrame);
        res.json(data);
    } catch (error) {
        console.error("Error fetching location data:", error);
        res.status(500).json({ message: "Error fetching location data", error: error.message });
    }
});



module.exports = router;
