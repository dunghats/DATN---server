const mongoose = require('mongoose');
const crypto = require('crypto');
const ROLE_ENUMS = require('../constants/roles');
const userSchema = new mongoose.Schema(
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
    },
    otpResetPass: {
      type: String,
      required: false
    },
    tokenDevice: {
      type: String
    },
    image: {
      type: String,
      default : ''
    },
    countPost: {
      type: Number,
      default: 5
    }
  },
  {
    timestamps: true
  }
);

// userSchema.methods = {
//   isAuthenticate(password) {
//     return this.password === this.encryptPassword(password);
//   },
//   encryptPassword(password) {
//     if (!password) return;
//     try {
//       return crypto.createHmac('sha256', this.salt).update(password.toString()).digest('hex');
//     } catch (error) {
//       return error;
//     }
//   }
// };
//
// userSchema.pre('save', function(next) {
//   this.salt = crypto.randomUUID();
//   this.password = this.encryptPassword(this.password);
//   next();
// });

export default mongoose.model('User', userSchema);
