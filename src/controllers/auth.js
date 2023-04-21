import User from '../models/user';
import { sign } from 'jsonwebtoken';
import { formatResponseSuccess, formatResponseError } from '../config';
import { rules } from '../constants/rules';
import ROLES_ENUM from '../constants/roles';

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const otpGenerator = require('otp-generator');

class Auth {
  async validRegister(req, res, next) {
    try {
      const requiredFields = ['email', 'phone', 'fullname', 'password'];

      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json(formatResponseError({ code: `missing_${field}` }));
        }
        if (rules[field] && !rules[field].test(req.body[field])) {
          return res.status(400).json(formatResponseError({ code: `invalid_${field}` }));
        }
      }
      next();
    } catch (error) {
      return res.status(400).json(formatResponseError(error));
    }
  }

  // [POST] api/auth/register
  async register(req, res) {
    try {
      const { email, phone } = req.body;

      const exist_email = await User.findOne({ email }).exec();

      if (exist_email) {
        return res.status(400).json(formatResponseError({ code: 'existing_email' }));
      }

      const exist_phone = await User.findOne({ phone }).exec();

      if (exist_phone) {
        return res.status(400).json(formatResponseError({ code: 'existing_phone' })); // đã tồn tại
      }
      const dataUserRequest = {
        email: req.body.email,
        phone: req.body.phone,
        fullname: req.body.fullname,
        password: req.body.password,
        role: req.body.role,
        otpResetPass: otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false }),
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

      return res.status(200).json(formatResponseSuccess(data));
    } catch (error) {
      console.log('register', error);
      return res.status(400).json(formatResponseError(error));
    }
  }

  async validLogin(req, res, next) {
    try {
      if (!req.body.username) {
        return res.status(400).json(formatResponseError({ code: 'missing_username' }));
      }
      if (!req.body.password) {
        return res.status(400).json(formatResponseError({ code: 'missing_password' }));
      }
      next();
    } catch (error) {
      return res.status(400).json(formatResponseError(error));
    }
  }

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
        return res.status(400).json(formatResponseError({ code: 'invalid_username' }));
      }

      const user = await User.findOne(filter).exec();
      if (!user || !user.isAuthenticate(password)) {
        return res.status(400).json(formatResponseError({ code: 'incorrect_credentials' }));
      }

      const accessToken = jwt.sign({ id: user.id }, config.secret, {
        // expiresIn: 86400 // 24 hours
      });

      const data = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        tokenDevice: user.tokenDevice,
        accessToken
      };

      return res.status(200).json(formatResponseSuccess(data));
    } catch (error) {
      return res.status(400).json(formatResponseError(error));
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
      return res.status(200).json(formatResponseSuccess(user));
    } catch (error) {
      console.error('[error]', error);
      return res.status(401).json(formatResponseError({ code: 'invalid_token' }));
    }
  }
}

export default new Auth();