const express = require('express');
const { upload } = require("../utils/multerConfig");
const router = express.Router();
const { uploadDiagnosis, reportDiagnosis } = require('../controllers/DiagnosisController');

router.post('/upload', uploadDiagnosis);
router.post('/report', reportDiagnosis);
module.exports = router;