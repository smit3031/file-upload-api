const Comment = require('../model/Comment');
const mongoose = require('mongoose'); 

const createComment = async ({ userId, imageId, content }) => {
    const comment = new Comment({
        user: userId,
        image: imageId,
        text: content
    });

    console.log('Comment object:', comment);

    await comment.save(); 
    return comment;
};

const createReply = async (commentId, { userId, text }) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  const reply = { user:userId, text };
  comment.replies.push(reply);
  await comment.save();
  return reply;
};

const getCommentsByImageId = async (imageId) => {
    const objectId = new mongoose.Types.ObjectId(imageId); 
    const comments = await Comment.find({ image: objectId }).populate( 
        {
            path : 'user',
            model: 'users',
            select : 'email password'
        }
    );
    
    if (!comments || comments.length === 0) {
        throw new Error('No comments found for this image');
    }
  
    return comments; 
};

module.exports = {
  createComment,
  createReply,
  getCommentsByImageId,
};