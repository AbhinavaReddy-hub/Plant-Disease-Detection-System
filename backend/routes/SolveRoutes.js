const express = require('express');
const { getCases, getCaseDetails } = require('../controllers/SolveController');
const router = express.Router();

// Route to get all cases
router.get('/cases', getCases);
router.get('/cases/:caseId', getCaseDetails); // New route for fetching case details
// router.post('/cases', solveCase);
module.exports = router;
