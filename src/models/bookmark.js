import mongoose, { Schema } from 'mongoose';

const bookmarkSchema = mongoose.Schema({
  idUser: {
    type: String
  }, idPost: {
    type: String
  }, isCheck: {
    type: Boolean, default: true
  }
});

export default mongoose.model('bookmark', bookmarkSchema);