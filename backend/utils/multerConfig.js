const multer = require("multer");

// Multer Storage Configuration (Memory Storage for Buffers)
exports.upload = multer({ storage: multer.memoryStorage() });
