import bookmark from '../models/bookmark';
import { formatResponseError, formatResponseSuccess } from '../config';

async function addBookmark(req, res) {
  try {
    const dataBookmark = {
      idUser: req.body.idUser, idPost: req.body.idPost
    };
    const saveBookmark = await new bookmark(dataBookmark).save();
    res.status(200).json(formatResponseSuccess(saveBookmark, true, 'Lưu thành công'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Lưu thất bại'));
  }
}

async function deleteBookmark(req, res) {
  try {
    const data = await bookmark.findOneAndDelete({
      idUser: req.params.idUser, idPost: req.params.idPost
    });
    res.status(200).json(formatResponseSuccess(data, true, 'Bỏ lưu thành công'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Bỏ lưu thất bại'));
  }
}

async function getBookmarkByIdUserAndIdPost(req, res) {
  try {
    const data = await bookmark.findOne({
      idUser: req.params.idUser, idPost: req.params.idPost
    });
    res.status(200).json(formatResponseSuccess(data, true, 'Thành công'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Thất bại'));
  }
}

async function listBookmarkById(req, res) {
  try {
    const dataBookmark = await bookmark.find({
      idUser: req.params.id
    });
    res.status(200).json(formatResponseSuccess(dataBookmark, true, 'Thành công'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Thất bại'));
  }
}


module.exports = {
  addBookmark, getBookmarkByIdUserAndIdPost, deleteBookmark,listBookmarkById
};