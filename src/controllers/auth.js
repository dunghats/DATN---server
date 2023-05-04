import User from '../models/user';
import { formatResponseError, formatResponseSuccess } from '../config';
import { rules } from '../constants/rules';
import ROLES_ENUM from '../constants/roles';

const crypto = require('crypto');
const bcyrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const otpGenerator = require('otp-generator');
const { generateOTP } = require('../services/OTP');

class Auth {
  // async validRegister(req, res, next) {
  //   try {
  //     const requiredFields = ['email', 'phone', 'fullname', 'password'];
  //
  //     for (let field of requiredFields) {
  //       if (!req.body[field]) {
  //         return res.status(400).json(formatResponseError({ code: `missing_${field}` }));
  //       }
  //       if (rules[field] && !rules[field].test(req.body[field])) {
  //         return res.status(400).json(formatResponseError({ code: `invalid_${field}` }));
  //       }
  //     }
  //     next();
  //   } catch (error) {
  //     return res.status(400).json(formatResponseError(error));
  //   }
  // }

  // [POST] api/auth/register
  async register(req, res) {
    try {

      const otpGenerated = generateOTP();
      const { email, phone } = req.body;

      const exist_email = await User.findOne({ email }).exec();

      if (exist_email) {
        return res.status(200).json(
          formatResponseError({ code: '404' }, false, 'Email đã được đăng kí')
        );
      }

      const exist_phone = await User.findOne({ phone }).exec();

      if (exist_phone) {
        return res.status(200).json(
          formatResponseError({ code: '404' }, false, 'Số điện thoại đã được đăng kí')
        );
      }
      const dataUserRequest = {
        email: req.body.email,
        phone: req.body.phone,
        fullname: req.body.fullname,
        password: bcyrpt.hashSync(req.body.password, 10),
        role: req.body.role,
        otpResetPass: otpGenerated,
        tokenDevice: req.body.tokenDevice
      };
      const user = await new User(dataUserRequest).save();

      const data = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        tokenDevice: user.tokenDevice
      };

      return res.status(200).json(formatResponseSuccess(data, true, 'Đăng kí thành công'));
    } catch (error) {
      console.log('register', error);
      return res.status(400).json(formatResponseError({ code: '404' }, false, 'Error'));
    }
  }

  // async validLogin(req, res, next) {
  //   try {
  //     if (!req.body.username) {
  //       return res.status(400).json(formatResponseError({ code: 'missing_username' }));
  //     }
  //     if (!req.body.password) {
  //       return res.status(400).json(formatResponseError({ code: 'missing_password' }));
  //     }
  //     next();
  //   } catch (error) {
  //     return res.status(400).json(formatResponseError(error));
  //   }
  // }

  // [POST] api/auth/login
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const filter = {};
      if (rules.email.test(username)) {
        filter.email = username;
      } else if (rules.phone.test(username)) {
        filter.phone = username;
      } else {
        return res.status(400).json(formatResponseError({ code: '404' }, false, 'invalid_username'));
      }

      const checkEmail = await User.findOne({ email: req.body.username });
      const checkPhone = await User.findOne({ phone: req.body.username });

      if (isGmail(req.body.username)) {
        if (!checkEmail) return res.status(200).json(
          formatResponseError({ code: '404' }, false, 'Email chưa được đăng kí')
        );
      }

      if (isPhoneNumber(req.body.username)) {
        if (!checkPhone) return res.status(200).json(
          formatResponseError({ code: '404' }, false, 'Số điện thoại chưa được đăng kí')
        );
      }


      const user = await User.findOne(filter).exec();

      const checkPass = bcyrpt.compareSync(req.body.password, user.password);

      if (!checkPass) return res.status(200).json(formatResponseError({ code: '404' }, false, 'Tài khoản hoặc mật khẩu không chính xác'));

      const accessToken = jwt.sign({ id: user.id }, config.secret, {
        // expiresIn: 86400 // 24 hours
      });

      const data = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        tokenDevice: user.tokenDevice,
        role: user.role,
        accessToken
      };

      return res.status(200).json(formatResponseSuccess(data, true, 'Đăng nhập thành công'));
    } catch (error) {
      console.log(error);
      return res.status(400).json(formatResponseError({ code: 'invalid_token' }, false, 'Lỗi đăng nhập'));
    }
  }

  // [GET] /api/auth/profile
  async profile(req, res) {
    try {
      const data = await User.findById(req.user.id).exec();
      const { _id, fullname, email, phone, avatar, role } = data;
      const user = {
        _id,
        fullname,
        email,
        phone,
        avatar,
        ...(role === ROLES_ENUM.ADMIN && { role })
      };
      return res.status(200).json(formatResponseSuccess(user, true, 'Success'));
    } catch (error) {
      console.error('[error]', error);
      return res.status(401).json(formatResponseError({ code: 'invalid_token' }, false, 'Error profile'));
    }
  }
}

function isPhoneNumber(input) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(input);
}

function isGmail(input) {
  const gmailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  return gmailRegex.test(input);
}

export default new Auth();
