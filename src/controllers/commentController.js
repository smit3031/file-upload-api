const commentService = require('../services/commentService');

const createComment = async (req, res) => {
    const { user, image, text } = req.body; 
  
    try {
      const comment = await commentService.createComment({ userId: user, imageId: image, content: text });
      res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
      res.status(500).json({ error: 'Error creating comment: ' + error.message });
    }
  };

const createReply = async (req, res) => {
  const { commentId } = req.params;
  const { userId, text } = req.body;

  try {
    const reply = await commentService.createReply(commentId, { userId, text });
    res.status(201).json({ message: 'Reply added successfully', reply });
  } catch (error) {
    res.status(500).json({ error: 'Error adding reply: ' + error.message });
  }
};

const getCommentsByImageId = async (req, res) => {
  const { imageId } = req.params;

  try {
    const comments = await commentService.getCommentsByImageId(imageId);
    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this image' });
    }
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments: ' + error.message });
  }
};

module.exports = {
  createComment,
  createReply,
  getCommentsByImageId,
};