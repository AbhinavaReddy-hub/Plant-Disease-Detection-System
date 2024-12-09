const express = require("express");
const { fetchUserHistory } = require("../controllers/HistoryController");
const router = express.Router();

// Route to fetch user history
router.get("/", async (req, res) => {
    try {
        const userId = parseInt(req.query.userId, 10);
        if (!userId) return res.status(400).json({ message: "Invalid or missing userId parameter" });

        const history = await fetchUserHistory(userId);
        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching user history:", error);
        res.status(500).json({ message: "Error fetching user history", error: error.message });
    }
});
module.exports = router;
