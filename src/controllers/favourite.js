import favourite from '../models/favourite';
import { formatResponseError, formatResponseSuccess } from '../config';

async function addFavourite(req, res) {
  try {
    const dataFavourite = {
      idUser: req.body.idUser, idPost: req.body.idPost
    };
    const data = await new favourite(dataFavourite).save();
    res.status(200).json(formatResponseSuccess(data, true, 'Yêu thích thành công'));
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
  addFavourite, getFavouriteByIdUserAndIdPost, deleteFavourite,getCountFavouriteByIdPost
};