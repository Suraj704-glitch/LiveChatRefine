const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');

// 1. Connection Status (Persistence ke liye)
router.get('/status', doubtController.getConnectionStatus);

// 2. Dashboard & History UI
router.get('/dashboard', doubtController.renderDashboard);
router.get('/history', doubtController.getHistory);

// 3. YouTube Operations
router.post('/youtube/connect', doubtController.connectYoutube);
router.post('/youtube/disconnect', doubtController.disconnectYoutube); // Break Connection

// 4. Data Processing
router.post('/analyze', doubtController.analyzeDoubts);

// 5. Delete History
router.delete('/history/all', doubtController.deleteAllHistory);
router.delete('/history/:id', doubtController.deleteSession);

module.exports = router;    