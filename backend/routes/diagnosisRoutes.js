const express = require('express');
const router = express.Router();
const { uploadDiagnosis } = require('../controllers/DiagnosisController');

router.post('/upload', uploadDiagnosis);

module.exports = router;
