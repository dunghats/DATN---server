import favourite from '../models/favourite';
import { formatResponseError, formatResponseSuccess } from '../config';
import post from '../models/post';
import User from '../models/user';
import notification from '../models/notification';

const FCM = require('fcm-node');
const Server_key = 'AAAALCrvcUE:APA91bFbr2F3dTmwO4-zllN-1lcaqn6zzCb4Q2yy798_zxp298ObbagjUhdPOLSTT7OaMO8vQH8Dueodzkq_gVsyKi-BdbBNFesQ6SsCTHHAeqK-m5DAPfIwG65U4rrwk2Zz87WOLy2w';
const fcm = new FCM(Server_key);
const _ = require('lodash');

async function addFavourite(req, res) {
  try {
    const dataFavourite = {
      idUser: req.body.idUser, idPost: req.body.idPost
    };
    const data = await new favourite(dataFavourite).save();
    res.status(200).json(formatResponseSuccess(data, true, 'Yêu thích thành công'));

    const dataPost = await post.findOne({ _id: req.body.idPost });

    const dataUserAction = await User.findOne({ _id: req.body.idUser });
    const dataUserPost = await User.findOne({ _id: dataPost.idUser });

    // nội dung bắn thông báo về
    const message = {
      to: dataUserPost.tokenDevice,
      notification: {
        title: dataUserAction.fullname,
        body: 'Đã bày tỏ cảm xúc về bài viết của bạn',
        sound: "default"
      },
      data: {
        title: dataUserAction.fullname,
        body: 'Đã bày tỏ cảm xúc về bài viết của bạn',
        idPost: dataPost._id,
        image: dataUserAction.image,
        type: 1
      },
      android: {
        'priority': 'high'
      }
    };
    const idUserRequest = req.body.idUser;
    const idUserData = dataUserPost._id;

    console.log('id1 ' + idUserRequest);
    console.log('id2 ' + idUserData);

    const dataNewNoti = {
      idPost: dataPost._id,
      idUser: dataPost.idUser,
      title: dataUserAction.fullname,
      content: 'Đã bày tỏ cảm xúc về bài viết của bạn',
      imagePost: dataUserAction.image,
      timeLong: Date.now(),
      type: 1
    };

    if (idUserRequest != idUserData) {
      fcm.send(message, function(err, response) {
        if (err) {
          console.log('Bắn Lỗi ' + err);
        } else {
          console.log('Bắn thành công');
        }
      });
      const saveOrder = await new notification(dataNewNoti).save();
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Yêu thích thất bại'));
  }
}

async function deleteFavourite(req, res) {
  try {
    const data = await favourite.findOneAndDelete({
      idUser: req.params.idUser, idPost: req.params.idPost
    });
    res.status(200).json(formatResponseSuccess(data, true, 'Bỏ thích thành công'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Bỏ thích thất bại'));
  }
}

async function getFavouriteByIdUserAndIdPost(req, res) {
  try {
    const data = await favourite.findOne({
      idUser: req.params.idUser, idPost: req.params.idPost
    });
    console.log(data);
    res.status(200).json(formatResponseSuccess(data, true, 'Thành công'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Thất bại'));
  }
}

async function getCountFavouriteByIdPost(req, res) {
  try {
    console.log(req.params.idPost);
    const data = await favourite.find({ idPost: req.params.idPost });
    console.log(data);
    res.status(200).json(formatResponseSuccess(data, true, 'Thành công'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Thất bại'));
  }
}

// async function getCountFavouriteByIdPost(req, res) {
//   console.log(req.params.id);
// }

module.exports = {
  addFavourite, getFavouriteByIdUserAndIdPost, deleteFavourite, getCountFavouriteByIdPost
};