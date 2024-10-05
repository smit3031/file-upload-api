const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'testfile.txt'); 
// 1 MB Chunks
const chunkSize = 1 * 1024 * 1024; 
const outputDir = path.join(__dirname, 'chunks'); 

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir); 
}

const createChunks = () => {
  const fileStats = fs.statSync(filePath);
  const totalChunks = Math.ceil(fileStats.size / chunkSize);

  const readStream = fs.createReadStream(filePath, { highWaterMark: chunkSize });

  let chunkIndex = 0;

  readStream.on('data', (chunk) => {
    const chunkPath = path.join(outputDir, `chunk${chunkIndex}`);
    fs.writeFileSync(chunkPath, chunk);
    console.log(`Created chunk ${chunkIndex}`);
    chunkIndex++;
  });

  readStream.on('end', () => {
    console.log('All chunks created successfully!');
  });

  readStream.on('error', (err) => {
    console.error('Error creating chunks:', err);
  });
};

createChunks();