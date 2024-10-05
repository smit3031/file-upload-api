const axios = require('axios');


const sendEmail = async () => {
  console.log("Sending email...");
  // Simulating an external email API call
  await axios.get('https://jsonplaceholder.typicode.com/posts/1');
  console.log("Email sent successfully.");
  return { message: 'Email sent successfully' };
};

const notifyUser = async () => {
  console.log("Notifying user...");
  // Simulating an external notification API call
  await axios.get('https://jsonplaceholder.typicode.com/posts/2');
  console.log("User notified successfully.");
  return { message: 'User notified successfully' };
};

// Implement timeout for parallel req. 
// Implement resumable uploads for uploads and configure chunk size of stream.
// Install mongo and mongoose and use that to store user details.
// Use dynamic request/respone for swagger api instead of static.
// Come up with good example of relationships in db in context of current task. 
// Try to implement gallery and comments 

module.exports = { sendEmail, notifyUser };

