import { formatResponseError, formatResponseSuccess } from '../config';
import comment from '../models/comment';
import post from '../models/post';
import User from '../models/user';
import notification from '../models/notification';

const FCM = require('fcm-node');
const Server_key = 'AAAALCrvcUE:APA91bFbr2F3dTmwO4-zllN-1lcaqn6zzCb4Q2yy798_zxp298ObbagjUhdPOLSTT7OaMO8vQH8Dueodzkq_gVsyKi-BdbBNFesQ6SsCTHHAeqK-m5DAPfIwG65U4rrwk2Zz87WOLy2w';
const fcm = new FCM(Server_key);

async function addComment(req, res) {
  try {
    let ts = Date.now();
    const dataComment = {
      idUser: req.body.idUser,
      idPost: req.body.idPost,
      content: req.body.content,
      parentCommentId: req.body.parentCommentId,
      timeLong: ts
    };
    const data = await new comment(dataComment).save();
    res.status(200).json(formatResponseSuccess(data, true, 'Bình luận thành công'));

    if (req.body.idPost != null) {
      sendNotificationComment(req.body.idPost, req.body.idUser, req.body.content);
    }
    if (req.body.parentCommentId != null) {
      sendNotificationCommentReply(req.body.parentCommentId ,req.body.idUser,req.body.content)
    }

  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Bình luận thất bại'));
  }
}

async function getListCommentParentByIdPost(req, res) {
  try {
    console.log(req.params.idPost);
    const data = await comment.find({ idPost: req.params.idPost });
    console.log(data);
    res.status(200).json(formatResponseSuccess(data, true, 'Thành công List Comment Parent'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Thất bại'));
  }
}

async function getListCommentChildrenByIdPost(req, res) {
  try {
    console.log(req.params.parentCommentId);
    const data = await comment.find({ parentCommentId: req.params.parentCommentId });
    console.log(data);
    res.status(200).json(formatResponseSuccess(data, true, 'Thành công List Comment Children'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Thất bại'));
  }
}

async function sendNotificationComment(idPost, idUser, comment) {
  const dataPost = await post.findOne({ _id: idPost });
  const dataUserAction = await User.findOne({ _id: idUser });
  const dataUserPost = await User.findOne({ _id: dataPost.idUser });
  const message = {
    to: dataUserPost.tokenDevice,
    notification: {
      title: dataUserAction.fullname,
      body: 'Đã bình luận bài viết của bạn: ' + comment,
      sound: 'default'
    },
    data: {
      title: dataUserAction.fullname,
      body: 'Đã bình luận bài viết của bạn: ' + comment,
      idPost: dataPost._id,
      image: dataUserAction.image,
      type: 2
    },
    android: {
      'priority': 'high'
    }
  };
  const idUserRequest = idUser;
  const idUserData = dataUserPost._id;
  const dataNewNoti = {
    idPost: dataPost._id,
    idUser: dataPost.idUser,
    title: dataUserAction.fullname,
    content: 'Đã bình luận bài viết của bạn: ' + comment,
    imagePost: dataUserAction.image,
    timeLong: Date.now(),
    type: 2
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
}

async function sendNotificationCommentReply(parentCommentId, idUserComment, content) {
  const dataComment = await comment.findOne({ _id: parentCommentId });
  const dataPost = await post.findOne({ _id: dataComment.idPost });
  // thằng comment cha
  const dataUserPost = await User.findOne({ _id: dataComment.idUser });
  // thằng reply comment
  const dataUserReply = await User.findOne({ _id: idUserComment });

  const message = {
    to: dataUserPost.tokenDevice,
    notification: {
      title: dataUserReply.fullname,
      body: 'Đã trả lời bình luận của bạn: ' + content,
      sound: 'default'
    },
    data: {
      title: dataUserReply.fullname,
      body: 'Đã trả lời bình luận của bạn: ' + content,
      idPost: dataPost._id,
      image: dataUserReply.image,
      type: 2
    },
    android: {
      'priority': 'high'
    }
  };

  const idUserReply = idUserComment;
  const idUserParent = dataComment.idUser;

  const dataNewNoti = {
    idPost: dataPost._id,
    idUser: dataUserPost._id,
    title: dataUserReply.fullname,
    content: 'Đã trả lời bình luận của bạn: ' + content,
    imagePost: dataUserReply.image,
    timeLong: Date.now(),
    type: 2
  };
  if (idUserReply != idUserParent) {
    fcm.send(message, function(err, response) {
      if (err) {
        console.log('Bắn Lỗi ' + err);
      } else {
        console.log('Bắn thành công');
      }
    });
    const saveOrder = await new notification(dataNewNoti).save();
  }
}

module.exports = {
  addComment, getListCommentParentByIdPost, getListCommentChildrenByIdPost
};