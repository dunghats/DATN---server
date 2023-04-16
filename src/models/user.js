import { Schema, model } from 'mongoose';
import { createHmac, randomUUID } from 'crypto';
import ROLE_ENUMS from '../constants/roles';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    fullname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
    salt: {
      type: String
    },
    verified: {
      type: Boolean,
      default: true
    },
    role: {
      type: Number,
      enum: Object.values(ROLE_ENUMS),
      default: ROLE_ENUMS.RENTER // mặc định sẽ là người thuê nhà
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods = {
  isAuthenticate(password) {
    return this.password === this.encryptPassword(password);
  },
  encryptPassword(password) {
    if (!password) return;
    try {
      return createHmac('sha256', this.salt).update(password.toString()).digest('hex');
    } catch (error) {
      return error;
    }
  }
};

userSchema.pre('save', function (next) {
  this.salt = randomUUID();
  this.password = this.encryptPassword(this.password);
  next();
});

export default model('User', userSchema);
