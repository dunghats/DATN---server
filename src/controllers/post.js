import post from '../models/post';
import { formatResponseError, formatResponseSuccess } from '../config';

async function addPost(req, res) {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  try {
    const data = {
      idUser: req.body.idUser,
      nameCategory: req.body.nameCategory,
      title: req.body.title,
      images: req.body.images,
      cty: req.body.cty,
      district: req.body.district,
      wards: req.body.wards,
      street: req.body.street,
      address: req.body.address,
      acreage: req.body.acreage,
      deposit: req.body.deposit,
      bedroom: req.body.bedroom,
      bathroom: req.body.bathroom,
      countPerson: req.body.countPerson,
      startDate: req.body.startDate,
      price: req.body.price,
      electricityPrice: req.body.electricityPrice,
      waterPrice: req.body.waterPrice,
      wifi: req.body.wifi,
      describe: req.body.describe,
      phone: req.body.phone,
      supplements: req.body.supplements,
      time: hours + ':' + minutes,
      date: date + '/' + month + '/' + year
    };
    const saveData = await new post(data).save();
    res.status(200).json(formatResponseSuccess(saveData, true, 'Đăng thành công, bài viết của bạn đang trong quá trình phê duyệt'));
  } catch (error) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Đăng bài thất bại'));
  }
}

async function updatePost(req, res) {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  try {
    const data = {
      idUser: req.body.idUser,
      nameCategory: req.body.nameCategory,
      title: req.body.title,
      images: req.body.images,
      cty: req.body.cty,
      district: req.body.district,
      wards: req.body.wards,
      street: req.body.street,
      address: req.body.address,
      acreage: req.body.acreage,
      deposit: req.body.deposit,
      bedroom: req.body.bedroom,
      bathroom: req.body.bathroom,
      countPerson: req.body.countPerson,
      startDate: req.body.startDate,
      price: req.body.price,
      electricityPrice: req.body.electricityPrice,
      waterPrice: req.body.waterPrice,
      wifi: req.body.wifi,
      describe: req.body.describe,
      phone: req.body.phone,
      supplements: req.body.supplements,
      timeEdit: hours + ':' + minutes,
      dateEdit: date + '/' + month + '/' + year,
      statusEdit: true,
      statusConfirm: false,
      messageConfirm: 'Đang chờ duyệt bài'
    };

    const dataUpdate = await post.updateOne({ _id: req.params.id }, data);
    res.status(200).json(formatResponseSuccess(dataUpdate, true, 'Sửa thành công, bài viết của bạn đang trong quá trình phê duyệt'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Cập nhật thất bại'));
  }
}

async function getPostById(req, res) {
  try {
    const data = await post.findById({ _id: req.params.id });
    res.status(200).json(formatResponseSuccess(data, true, 'Get Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

async function deletePost(req, res) {
  try {
    const data = await post.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(formatResponseSuccess(data, true, 'Delete Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Delete Failed'));
  }
}

// getListHOme
async function getListPostByUser(req, res) {
  try {
    const filter = {
      statusConfirm : true
    };
    const data = await post.find(filter);
    res.status(200).json(formatResponseSuccess(data, true, 'Get Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

// list các bài đã đăng của user
async function getListPostByMyself(req, res) {
  try {
    const filter = {
      _id: req.params.id
    };
    const data = await post.find(filter);
    res.status(200).json(formatResponseSuccess(data, true, 'Get Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

///////////////// admin
/// xác nhận bài viết
async function confirmPostByAdmin(req, res) {
  try {
    const data = {
      statusConfirm: true,
      messageConfirm: 'Đã phê duyệt'
    };
    const dataUpdate = await post.updateOne({ _id: req.params.id }, data);
    res.status(200).json(formatResponseSuccess(dataUpdate, true, 'Phê duyệt thành công'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Update Failed'));
  }
}

// huỷ bài viết
async function cancelPostByAdmin(req, res) {
  try {
    const data = {
      statusConfirm: false,
      messageConfirm: 'Bài viết bị huỷ',
      textConfirm: req.body.textConfirm
    };
    const dataUpdate = await post.updateOne({ _id: req.body.id }, data);
    res.status(200).json(formatResponseSuccess(dataUpdate, true, 'Huỷ thành công'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Update Failed'));
  }
}

//getList Post Chưa phê duyệt của thành admin
async function getListPostNoConfirmByAdmin(req, res) {
  try {
    const filter = {
      statusConfirm : false
    };
    const data = await post.find(filter);
    res.status(200).json(formatResponseSuccess(data, true, 'Get Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

module.exports = {
  addPost, updatePost, getPostById, deletePost,getListPostByUser ,getListPostByMyself ,
  confirmPostByAdmin,cancelPostByAdmin,getListPostNoConfirmByAdmin
};