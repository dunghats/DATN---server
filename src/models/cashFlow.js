import mongoose, { Schema } from 'mongoose';

const cashFlow = mongoose.Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    dateTime: {
      type: String
    },
    price: {
      type: Number
    },
    status: {
      type: Boolean,
      default: true
    },
    timeLong: {
      type: Number
    },
  }
);

export default mongoose.model('cashFlow', cashFlow);