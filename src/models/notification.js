import mongoose, { Schema } from 'mongoose';

const NotificationSchema = mongoose.Schema(
  {
    idPost: {
      type: String
    },
    idUser: {
      type: String
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    type: {
      type: Number
    },
    imagePost: {
      type: String
    },
    timeLong: {
      type: Number
    },
    isSeem: {
      type: Boolean,
      default: true
    }
  }
);

export default mongoose.model('notification', NotificationSchema);