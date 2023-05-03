import { formatResponseError, formatResponseSuccess } from '../config';
import comment from '../models/comment';
import favourite from '../models/favourite';

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
    console.log(data);
    res.status(200).json(formatResponseSuccess(data, true, 'Bình luận thành công'));
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

module.exports = {
  addComment, getListCommentParentByIdPost,getListCommentChildrenByIdPost
};