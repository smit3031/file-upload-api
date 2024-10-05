const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const uploadChunk = async (chunkIndex, chunkSize, totalChunks) => {
  const start = chunkIndex * chunkSize;
  const end = Math.min(start + chunkSize, 10 * 1024 * 1024); // 10 MB
  const filePath = 'testfile.txt'; // Ensure you have created this test file

  const chunk = fs.createReadStream(filePath, { start, end: end - 1 });

  const formData = new FormData();
  formData.append('file', chunk, { filename: 'testfile.txt' });
  formData.append('chunkIndex', chunkIndex);
  formData.append('totalChunks', totalChunks);

  try {
    const response = await axios.post('http://localhost:3001/file/upload-chunk', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log(`Uploaded chunk ${chunkIndex + 1}: ${response.data.message}`);
  } catch (error) {
    console.error(`Failed to upload chunk ${chunkIndex + 1}:`, error.message);
  }
};

const checkChunkStatus = async () => {
  const filename = 'testfile.txt';
  try {
    const response = await axios.get(`http://localhost:3001/file/chunk-status/${filename}`);
    console.log(`Uploaded chunks status:`, response.data);
  } catch (error) {
    console.error(`Failed to check chunk status:`, error.message);
  }
};

const resumeUpload = async () => {
  const chunkSize = 500 * 1024; // 500 KB
  const totalChunks = Math.ceil(10 * 1024 * 1024 / chunkSize); // Total chunks for 10MB

  // Check which chunks have been uploaded
  const response = await axios.get('http://localhost:3001/file/chunk-status/testfile.txt');
  const uploadedChunks = response.data;

  // Resume from the next chunk
  for (let i = 0; i < totalChunks; i++) {
    if (!uploadedChunks[i]) { // If this chunk has not been uploaded
      await uploadChunk(i, chunkSize, totalChunks);
    }
  }

  console.log('Resumed upload completed');
};

const main = async () => {
  const chunkSize = 500 * 1024; // 500 KB
  const totalChunks = Math.ceil(10 * 1024 * 1024 / chunkSize); // Total chunks for 10MB

  // Upload chunks until 4MB (8 chunks of 500KB)
  for (let i = 0; i < Math.min(totalChunks, 8); i++) {
    await uploadChunk(i, chunkSize, totalChunks);
  }

  console.log('Stopped uploading after 4MB');

  // Check the status of uploaded chunks
  await checkChunkStatus();

  // Resume the upload
  await resumeUpload();
};

main();