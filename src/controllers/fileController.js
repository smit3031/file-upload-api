const fileService = require('../services/fileService');

const uploadFile = async (req, res) => {
  try {
    const timeout = 15000; 
    const result = await fileService.handleFileUpload(req.file, timeout);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error uploading file', error: error.message });
  }
};

const uploadChunk = async (req, res) => {
  try {
    console.log("Request Body:", req.body); 
    const { chunkIndex, totalChunks, userId, filename } = req.body; 

    console.log(filename);
    if (!filename) {
      return res.status(400).send({ message: 'Filename is required.' });
    }

    const result = await fileService.handleChunkedUpload(req.file, chunkIndex, totalChunks, userId, filename); 
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error uploading chunk', error: error.message });
  }
};

const getImagesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const images = await fileService.getImagesByUserId(userId);

    return res.status(200).json({ images });
  } catch (error) {
    console.error("Error fetching images:", error.message);
    return res.status(500).json({ error: `Error fetching images: ${error.message}` });
  }
};

module.exports = { uploadFile, uploadChunk, getImagesByUserId };