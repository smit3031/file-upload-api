# Replace this with the desired user ID and filename
userId="66fbe23425276ade1d3452bf"
filename="eoub_sample.txt"  # Add the filename you want to use

for i in {0..9}; do
  curl -v -X POST http://localhost:3001/file/upload-chunk \
  -F "file=@chunks/chunk$i" \
  -F "chunkIndex=$i" \
  -F "totalChunks=10" \
  -F "userId=$userId" \
  -F "filename=$filename"  # Include the filename here
done