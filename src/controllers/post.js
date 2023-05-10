import post from '../models/post';
import { formatResponseError, formatResponseSuccess } from '../config';
import User from '../models/user';
import cashFlow from '../models/cashFlow';

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
      date: date + '/' + month + '/' + year,
      timeLong: ts,

      advertisement: req.body.advertisement,
      timeAdvertisement: req.body.timeAdvertisement,
      priceAll: req.body.priceAll

    };

    const dataUser = await User.findById(req.body.idUser);

    console.log(dataUser);
    let priceCashFlow = dataUser.priceCashFlow;
    let countPost = dataUser.countPost;
    let content = '';

    console.log(priceCashFlow);

    //trừ tiền bao gồm cả tổng tiền quảng cáo

    if (req.body.advertisement) {
      if (countPost > 5) {
        content = 'Thanh toán bài đăng bao gồm: giá đăng bài (20.000 nghìn) + ' + req.body.timeAdvertisement + ' ngày quảng cáo (50.000 nghìn/ngày)';
      } else {
        content = 'Thanh toán bài đăng bao gồm: giá đăng bài(free) + ' + req.body.timeAdvertisement + ' ngày quảng cáo (50.000 nghìn/ngày)';
      }
    } else {
      if (countPost > 5) {
        content = 'Thanh toán bài đăng bao gồm: giá đăng bài (20.000 nghìn)';
      } else {
        content = 'Thanh toán bài đăng bao gồm: giá đăng bài(free)';
      }
    }
    await User.findOneAndUpdate({ _id: req.body.idUser }, { priceCashFlow: priceCashFlow -= parseInt(req.body.priceAll) }, { new: true });
    // update số lượng bài viết của user
    await User.findOneAndUpdate({ _id: req.body.idUser }, { countPost: countPost += 1 }, { new: true });

    // tạo lịch sử giao dịch tiền
    if (countPost > 5) {
      const dataCashFlow = {
        idUser: req.body.idUser,
        title: 'Thông báo biến động số dư',
        content: content,
        price: req.body.priceAll,
        dateTime: hours + ':' + minutes + ' ' + date + '-' + month + '-' + year,
        status: false
      };
      await new cashFlow(dataCashFlow).save();
    }

    //create noti


    //create post
    const saveData = await new post(data).save();
    res.status(200).json(formatResponseSuccess(saveData, true, 'Đăng thành công, bài viết của bạn đang trong quá trình phê duyệt'));
  } catch (error) {
    console.log(error);
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
      statusConfirm: true
    };
    const data = await post.find(filter);
    res.status(200).json(formatResponseSuccess(data.reverse(), true, 'Get Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

// list các bài đã đăng của user


///////////////// admin
/// xác nhận bài viết
async function confirmPostByAdmin(req, res) {
  try {
    const data = {
      statusConfirm: true, messageConfirm: 'Đã phê duyệt'
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
      statusConfirm: false, messageConfirm: 'Bài viết bị huỷ', textConfirm: req.body.textConfirm
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
      statusConfirm: false
    };
    const data = await post.find(filter);
    res.status(200).json(formatResponseSuccess(data, true, 'Get Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

async function getListPostByMyself(req, res) {
  try {
    console.log(req.params.id);
    const filter = {
      idUser: req.params.id
    };
    const data = await post.find(filter);
    res.status(200).json(formatResponseSuccess(data.reverse(), true, 'Get Success'));
  } catch (e) {
    console.log(e);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

async function updatePostAds(req, res) {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  try {
    const dataUser = await User.findById(req.body.idUser);
    console.log(dataUser);
    let priceCashFlow = dataUser.priceCashFlow;
    const data = {
      advertisement: req.body.advertisement,
      timeAdvertisement: req.body.timeAdvertisement,
      priceAll: req.body.priceAll,
      timeEdit: hours + ':' + minutes,
      dateEdit: date + '/' + month + '/' + year,
    };
    // trừ tiền user
    await User.findOneAndUpdate({ _id: req.body.idUser }, { priceCashFlow: priceCashFlow -= parseInt(req.body.priceAll) }, { new: true });
    // tạo biến động số dư
    const dataCashFlow = {
      idUser: req.body.idUser,
      title: 'Thông báo biến động số dư',
      content: 'Thanh toán quảng cáo: ' + req.body.timeAdvertisement + ' ngày quảng cáo (50.000 nghìn/ngày)',
      price: req.body.priceAll,
      dateTime: hours + ':' + minutes + ' ' + date + '-' + month + '-' + year,
      status: false
    };
    await new cashFlow(dataCashFlow).save();

    const dataUpdate = await post.updateOne({ _id: req.body._id }, data);
    res.status(200).json(formatResponseSuccess(dataUpdate, true, 'Quảng cáo bài viết thành công'));

  } catch (e) {
    console.log(e);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

async function updateStatusRoom(req, res) {
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
      statusRoom : req.body.statusRoom,
      messageRoom : req.body.messageRoom,
      statusEdit: true,
      timeEdit: hours + ':' + minutes,
      dateEdit: date + '/' + month + '/' + year,
    };

    const dataUpdate = await post.updateOne({ _id: req.body._id }, data);
    res.status(200).json(formatResponseSuccess(dataUpdate, true, 'Cập nhật thành công'));
  } catch (e) {
    console.log(e);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}


async function getStatusPost(req, res) {
  try {
    const data = await post.findById({ _id: req.params.id });
    console.log(data.statusRoom);
    res.status(200).json(data.statusRoom);
  } catch (e) {
    res.status(200).json(e);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

async function getStatusAds(req, res) {
  try {
    const data = await post.findById({ _id: req.params.id });
    console.log(data.advertisement);
    res.status(200).json(data.advertisement);
  } catch (e) {
    res.status(200).json(e);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}


module.exports = {
  addPost,
  updatePost,
  getPostById,
  deletePost,
  getListPostByUser,
  getListPostByMyself,
  confirmPostByAdmin,
  cancelPostByAdmin,
  getListPostNoConfirmByAdmin,
  updatePostAds,
  updateStatusRoom,
  getStatusPost,
  getStatusAds
}