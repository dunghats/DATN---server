import User from '../models/user';
import { formatResponseError, formatResponseSuccess } from '../config';
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { sendMailForgotPassword } = require('../services/MAIL');
function moderatorBoard(req, res) {
  res.status(200).send('User Content.');
}

async function isModerator(req, res, next) {
  const userResponse = await User.findById(req.id);
  const data = {
    _id: userResponse._id,
    fullname: userResponse.fullname,
    email: userResponse.email,
    phone: userResponse.phone,
    tokenDevice: userResponse.tokenDevice
  };
  res.status(200).json(formatResponseSuccess(data));
}

function verifyToken(req, res, next) {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.id = decoded.id;
    next();
  });
}

async function sendMailForgotPass(req, res) {
  try {
    const checkEmail = await User.findOne({ email: req.body.email });
    if (!checkEmail) {
      return res.status(200).json({ status: false, message: 'Email chưa được đăng kí' });
    }
    console.log(checkEmail.otpResetPass);
    console.log(req.body.email);
    await sendMailForgotPassword({
      to: req.body.email,
      OTP: checkEmail.otpResetPass
    });

    return res.status(200).json({
      status: true,
      message: 'Đã gửi tới'
    });
  } catch (error) {
    console.log(error);
    res.status(200).json(formatResponseError({ code: '404' }, false, 'Mail chưa được đăng kí'));
  }
}

async function validateUserPass(req, res) {
  try {
    const userData = await User.findOne({
      email: req.body.email
    });
    if (!userData) {
      return res.status(200).json({ status: false, message: 'Email không tồn tại' });
    }
    if (userData && userData.otpResetPass !== req.body.otp) {
      return res.status(200).json({ status: false, message: 'OTP không chính xác' });
    }
    return res.status(200).json({ status: true, message: 'OTP chính xác' });
  } catch (error) {
    res.status(200).json(formatResponseError({ code: '404' }, false, 'Mail chưa được đăng kí'));
  }
}

async function newPass(req, res) {
  try {
    const userData = await User.findOne({
      email: req.body.username
    });
    if (!userData) {
      return res.status(200).json({ status: false, message: 'Email không tồn tại' });
    }

    const passHass = bcyrpt.hashSync(req.body.password, 10)

    const updatedUser = await User.findByIdAndUpdate(userData._id, {
      $set: { password: passHass  }
    });
    return res.status(200).json({ status: true, message: 'Mật khẩu đã được thay đổi' });
  } catch (error) {
    res.status(200).json(formatResponseError({ code: '404' }, false, 'Mail chưa được đăng kí'));
  }
}

async function updateCheckTokenDevice   (req , res){
  try {
    const dataUserUpdate = await User.findOneAndUpdate(
      { _id: req.body.id },
      { tokenDevice: req.body.tokenDevice },
      { new: true }
    )
    return  res.status(200).json({
      status: true,
      message: 'Update thành công'
    })
  } catch (error) {
    res.status(200).json(formatResponseError({ code: '404' }, false, 'nodata'))
  }
}

module.exports = {
  moderatorBoard, isModerator, verifyToken, sendMailForgotPass, validateUserPass, newPass,updateCheckTokenDevice
};