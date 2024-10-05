const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: { type: String, required: true }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, 
  createdAt: { type: Date, default: Date.now } 
});

const commentSchema = new mongoose.Schema({
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },  
    text: { type: String, required: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, 
    replies: [replySchema], 
    createdAt: { type: Date, default: Date.now } 
});
  
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;