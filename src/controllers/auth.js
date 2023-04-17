import User from '../models/user';
import { sign } from 'jsonwebtoken';
import { formatResponseSuccess, formatResponseError } from '../config';
import { rules } from '../constants/rules';

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

      const user = await new User({ ...req.body }).save();

      const data = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone
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
        return res.status(400).json(formatResponseError({ code: 'missing_username' }));
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

      const accessToken = sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1y' });

      const data = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        accessToken
      };

      return res.status(200).json(formatResponseSuccess(data));
    } catch (error) {
      return res.status(400).json(formatResponseError(error));
    }
  }
}

export default new Auth();
