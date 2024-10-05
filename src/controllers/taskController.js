const { sendEmail, notifyUser } = require('../services/taskService');


const executeSequentialTasks = async (req, res) => {
  console.log("Sequential tasks endpoint hit");
  try {

    const emailResult = await sendEmail();
    const notifyResult = await notifyUser();
    
    res.status(200).json({
      message: 'Sequential tasks executed successfully',
      results: { email: emailResult, notification: notifyResult },
    });
  } catch (error) {
    console.error("Error executing sequential tasks:", error.message);
    res.status(500).json({ message: 'Error executing tasks', error: error.message });
  }
};


const executeParallelTasks = async (req, res) => {
    console.log("Parallel tasks endpoint hit");
    try {
      const results = await Promise.allSettled([sendEmail(), notifyUser()]);
      
      const emailResult = results[0];
      const notifyResult = results[1];
  
      const response = {
        message: 'Parallel tasks executed with partial success',
        results: {
          email: emailResult.status === 'fulfilled' ? emailResult.value : `Failed: ${emailResult.reason.message}`,
          notification: notifyResult.status === 'fulfilled' ? notifyResult.value : `Failed: ${notifyResult.reason.message}`,
        },
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error("Unexpected error executing parallel tasks:", error.message);
      res.status(500).json({ message: 'Error executing tasks', error: error.message });
    }
  };

module.exports = { executeSequentialTasks, executeParallelTasks };