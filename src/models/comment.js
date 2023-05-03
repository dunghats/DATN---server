import mongoose, { Schema } from 'mongoose';

const commentSchema = mongoose.Schema({
  idUser: {
    type: String
  },
  idPost: {
    type: String
  },
  timeLong: {
    type: String
  },
  content: {
    type: String
  },
  parentCommentId: {
    type: String,
    default: null
  }
});

export default mongoose.model('comment', commentSchema);