const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const File = require('../model/File');
const UploadStatus = require('../model/UploadStatus');

const handleChunkedUpload = async (file, chunkIndex, totalChunks, userId, filename, timeout = 10000) => {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      return reject(new Error('No file uploaded'));
    }

    if (!totalChunks) {
      return res.status(400).send({ error: 'totalChunks is required' });
    }

    console.log(`Chunk received: ${file.originalname}, Size: ${file.size} bytes, Chunk Index: ${chunkIndex}/${totalChunks}`);
    console.log(filename);
    const uniqueFileIdentifier = `${userId}_${filename}`;
    const filePath = path.join(__dirname, '../uploads', `chunk_${uniqueFileIdentifier}_${chunkIndex}`);

    try {
      // Check if the file's upload status already exists and if the chunk is already uploaded
      let uploadStatus = await UploadStatus.findOne({ userId, filename });
      if (uploadStatus && uploadStatus.uploadedChunks.includes(chunkIndex)) {
        console.log(`Chunk ${chunkIndex} already uploaded for file: ${filename}. Skipping...`);
        return resolve({
          message: 'Chunk already uploaded',
          filename: uniqueFileIdentifier,
          chunkIndex,
          totalChunks,
          uploadedChunks: uploadStatus.uploadedChunks,
        });
      }

      const writeStream = fs.createWriteStream(filePath);
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      const timeoutHandle = setTimeout(() => {
        writeStream.destroy(new Error('File upload timed out'));
      }, timeout);

      readableStream.pipe(writeStream);

      writeStream.on('finish', async () => {
        clearTimeout(timeoutHandle);

        // Create or update the upload status in MongoDB
        uploadStatus = await UploadStatus.findOneAndUpdate(
          { userId, filename },
          { $addToSet: { uploadedChunks: chunkIndex }, totalChunks },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        const uploadedChunksCount = uploadStatus.uploadedChunks.length;

        console.log(`Uploaded chunks for ${uniqueFileIdentifier}:`, uploadStatus.uploadedChunks);

        // If all chunks are uploaded, merge them
        if (uploadedChunksCount === Number(totalChunks)) {
          console.log(`All ${totalChunks} chunks uploaded successfully. Initiating merge for ${uniqueFileIdentifier}...`);

          const mergedFilePath = await mergeChunks(uniqueFileIdentifier, totalChunks);
          const timestamp = Date.now();


          const fileExtension = path.extname(filename).toLowerCase();
          const isImage = ['.png', '.jpg', '.jpeg'].includes(fileExtension);

          const fileDoc = await File.create({
            filename: filename,
            url: mergedFilePath,
            user: userId,
            createdAt: timestamp,
            isImage: isImage 
          });

          // Update the upload status to indicate merging is completed
          uploadStatus.merged = true;
          uploadStatus.filePath = mergedFilePath;
          await uploadStatus.save();

          console.log(`File saved to the database with ID: ${fileDoc._id}`);
          resolve({
            message: 'File upload and merge completed successfully',
            filename: uniqueFileIdentifier,
            totalChunks,
          });
        } else {
          resolve({
            message: 'Chunk uploaded successfully',
            filename: uniqueFileIdentifier,
            chunkIndex,
            totalChunks,
            uploadedChunks: uploadStatus.uploadedChunks,
          });
        }
      });

      writeStream.on('error', (err) => {
        clearTimeout(timeoutHandle);
        reject(new Error('Error uploading chunk: ' + err.message));
      });

      readableStream.on('error', (err) => {
        clearTimeout(timeoutHandle);
        reject(new Error('Error in readable stream: ' + err.message));
      });

    } catch (error) {
      reject(new Error('Error handling chunk upload: ' + error.message));
    }
  });
};

const mergeChunks = async (uniqueFileIdentifier, totalChunks) => {
  console.log(`Merging chunks for file: ${uniqueFileIdentifier} with totalChunks: ${totalChunks}`);
  const mergedFilePath = path.join(__dirname, '../uploads', `merged_${uniqueFileIdentifier}`);
  const writeStream = fs.createWriteStream(mergedFilePath);

  const mergePromises = [];
  for (let i = 0; i < totalChunks; i++) {
    const chunkFilePath = path.join(__dirname, '../uploads', `chunk_${uniqueFileIdentifier}_${i}`);
    mergePromises.push(new Promise((resolve, reject) => {
      console.log(`Merging chunk: ${chunkFilePath}`);
      const readStream = fs.createReadStream(chunkFilePath);
      readStream.pipe(writeStream, { end: false });
      readStream.on('end', () => resolve());
      readStream.on('error', reject);
    }));
  }

  await Promise.all(mergePromises);
  writeStream.end();

  console.log(`All chunks merged into: ${mergedFilePath}`);

  // Delete temporary chunk files after merge
  for (let i = 0; i < totalChunks; i++) {
    const chunkFilePath = path.join(__dirname, '../uploads', `chunk_${uniqueFileIdentifier}_${i}`);
    fs.unlink(chunkFilePath, (err) => {
      if (err) {
        console.error(`Error deleting chunk ${chunkFilePath}: ${err.message}`);
      } else {
        console.log(`Successfully deleted chunk: ${chunkFilePath}`);
      }
    });
  }

  return mergedFilePath;
};

const getImagesByUserId = async (userId) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const images = await File.find({ user: userId, isImage: true }).lean();

  if (!images || images.length === 0) {
    throw new Error("No images found for this user");
  }

  return images; 
};

module.exports = { handleChunkedUpload, getImagesByUserId };