import User from '../models/user';
import { formatResponseError, formatResponseSuccess } from '../config';
import ROLE_ENUMS from '../constants/roles';
import notification from '../models/notification';
import bookmark from '../models/bookmark';

const bcyrpt = require('bcrypt');
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
    role: userResponse.role,
    image: userResponse.image,
    tokenDevice: userResponse.tokenDevice,
    textReport : userResponse.textReport,
    verified: userResponse.verified
  };
  res.status(200).json(formatResponseSuccess(data, true, 'Đăng nhập thành công'));
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
      to: req.body.email, OTP: checkEmail.otpResetPass
    });

    return res.status(200).json({
      status: true, message: 'Đã gửi tới'
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

    const passHass = bcyrpt.hashSync(req.body.password, 10);

    const updatedUser = await User.findByIdAndUpdate(userData._id, {
      $set: { password: passHass }
    });
    return res.status(200).json({ status: true, message: 'Mật khẩu đã được thay đổi' });
  } catch (error) {
    res.status(200).json(formatResponseError({ code: '404' }, false, 'Mail chưa được đăng kí'));
  }
}

async function updateCheckTokenDevice(req, res) {
  try {
    const dataUserUpdate = await User.findOneAndUpdate({ _id: req.body.id }, { tokenDevice: req.body.tokenDevice }, { new: true });
    return res.status(200).json({
      status: true, message: 'Update thành công'
    });
  } catch (error) {
    res.status(200).json(formatResponseError({ code: '404' }, false, 'nodata'));
  }
}

async function getUserById(req, res) {
  try {
    const dataUser = await User.findById(req.params.id);
    return res.status(200).json({
      _id: dataUser._id,
      fullname: dataUser.fullname,
      image: dataUser.image,
      email: dataUser.email,
      phone: dataUser.phone,
      role: dataUser.role,
      address: dataUser.address,
      personId: dataUser.personId
    });
  } catch (error) {
    console.log(error);
    res.status(200).json(formatResponseError({ code: '404' }, false, 'nodata'));
  }
}

async function getCash(req, res) {
  try {
    const userData = await User.findOne({ _id: req.params.id });
    res.status(200).json(userData.priceCashFlow);
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

async function changeInFo(req, res) {
  try {
    const dataUser = await User.findOneAndUpdate({ _id: req.body.id }, {
      fullname: req.body.fullname, personId: req.body.personId, address: req.body.address, image: req.body.image
    }, { new: true });
    const data = {
      _id: dataUser._id,
      fullname: dataUser.fullname,
      image: dataUser.image,
      email: dataUser.email,
      phone: dataUser.phone,
      role: dataUser.role
    };
    return res.status(200).json(formatResponseSuccess(data, true, 'Update thành công'));
  } catch (error) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Update thất bại'));
  }
}

async function updateAccount(req, res) {
  try {
    const dataUser = await User.findOneAndUpdate({ _id: req.params.id }, {
      role: ROLE_ENUMS.HOST
    }, { new: true });
    const data = {
      _id: dataUser._id,
      fullname: dataUser.fullname,
      image: dataUser.image,
      email: dataUser.email,
      phone: dataUser.phone,
      role: dataUser.role
    };
    return res.status(200).json(formatResponseSuccess(data, true, 'Update thành công'));
  } catch (error) {
    console.log(error);
    res.status(200).json(formatResponseError({ code: '404' }, false, 'Update thất bại'));
  }
}

async function updatePassword(req, res) {
  try {
    const checkEmail = await User.findOne({ _id: req.body.id });
    const checkPass = bcyrpt.compareSync(req.body.password, checkEmail.password);
    if (!checkPass) return res.status(200).json({
      status: 'false', message: 'Mật khẩu cũ không đúng'
    });
    const passHass = bcyrpt.hashSync(req.body.passwordNew, 10);
    const dataUserUpdate = await User.findOneAndUpdate({ _id: req.body.id }, {
      password: passHass
    }, { new: true });
    return res.status(200).json({
      status: true, message: 'Thay đổi thành công'
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false, message: 'User không tồn tại'
    });
  }
}

async function getCountPost(req, res) {
  try {
    const userData = await User.findOne({ _id: req.params.id });
    res.status(200).json(userData.countPost);
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

async function getListNotificationByIdUser(req, res) {
  try {
    const dataNotification = await notification.find({
      idUser: req.params.id
    });
    res.status(200).json(formatResponseSuccess(dataNotification.reverse(), true, 'Thành công'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Thất bại'));
  }
}

async function updateNotificationSeen(req, res) {
  try {
    const dataNotification = await notification.findOneAndUpdate(
      { _id: req.params.id },
      { isSeem: false },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: 'Update success'
    });

  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Update faild'
    });
  }
}

module.exports = {
  moderatorBoard,
  isModerator,
  verifyToken,
  sendMailForgotPass,
  validateUserPass,
  newPass,
  updateCheckTokenDevice,
  getUserById,
  getCash,
  updateAccount,
  changeInFo,
  updatePassword,
  getCountPost,
  getListNotificationByIdUser,
  updateNotificationSeen
};