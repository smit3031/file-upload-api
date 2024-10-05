const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/authMiddleware');
const fileController = require('../controllers/fileController');
const User = require('../model/User');

const router = express.Router();


const uploadDir = path.join(__dirname, '../uploads'); 

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage(); 

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); 

const validateUserId = async (req, res, next) => {
  console.log('Request Body:', req.body);
  const userId = req.body.userId; 
  if (!userId) {
    return res.status(400).send({ message: 'userId is required.' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ message: 'Invalid userId.' });
  }
  next();
};

/**
 * @swagger
 * /file/upload:
 *   post:
 *     summary: Upload a file chunk
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []  # Apply JWT only for this route
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               chunkIndex:
 *                 type: integer
 *               totalChunks:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Chunk uploaded successfully
 *       401:
 *         description: Unauthorized, JWT token missing or invalid
 *       500:
 *         description: Error uploading chunk
 */
router.post('/upload-chunk', upload.single('file'), validateUserId, fileController.uploadChunk);

// Endpoint to check the upload status of a specific file
router.get('/chunk-status/:filename', (req, res) => {
  const { filename } = req.params;
  res.json(chunkStatus[filename] || {});
});
router.get('/images/:userId', fileController.getImagesByUserId);

module.exports = router;