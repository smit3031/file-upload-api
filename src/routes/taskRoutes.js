const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/sequential', verifyToken, taskController.executeSequentialTasks);

router.get('/parallel', verifyToken, taskController.executeParallelTasks);

module.exports = router;