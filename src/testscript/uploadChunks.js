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

const main = async () => {
  const chunkSize = 500 * 1024; // 500 KB
  const totalChunks = Math.ceil(10 * 1024 * 1024 / chunkSize); // Total chunks for 10MB

  // Upload chunks until 4MB (8 chunks of 500KB)
  for (let i = 0; i < Math.min(totalChunks, 8); i++) {
    await uploadChunk(i, chunkSize, totalChunks);
  }

  console.log('Stopped uploading after 4MB');
};

main();