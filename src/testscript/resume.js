const fs = require('fs');
const axios = require('axios');

const checkChunkStatus = async () => {
  const filename = 'testfile.txt';
  try {
    const response = await axios.get(`http://localhost:3001/file/chunk-status/${filename}`);
    console.log(`Uploaded chunks status:`, response.data);
    return response.data; // Return status for further processing
  } catch (error) {
    console.error(`Failed to check chunk status:`, error.message);
    return null;
  }
};

const uploadChunk = async (chunkIndex, chunkSize, totalChunks) => {
  // Reuse the uploadChunk function from the previous file or copy its code here.
  // Ensure this function is defined here as well.
};

const resumeUpload = async () => {
  const chunkSize = 500 * 1024; // 500 KB
  const totalChunks = Math.ceil(10 * 1024 * 1024 / chunkSize); // Total chunks for 10MB

  const uploadedChunks = await checkChunkStatus();

  // Resume from the next chunk
  if (uploadedChunks) {
    for (let i = 0; i < totalChunks; i++) {
      if (!uploadedChunks[i]) { // If this chunk has not been uploaded
        await uploadChunk(i, chunkSize, totalChunks);
      }
    }
    console.log('Resumed upload completed');
  }
};

const main = async () => {
  await resumeUpload();
};

main();