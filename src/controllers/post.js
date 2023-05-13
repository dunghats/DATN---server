import post from '../models/post';
import { formatResponseError, formatResponseSuccess } from '../config';
import User from '../models/user';
import cashFlow from '../models/cashFlow';
import notification from '../models/notification';

const FCM = require('fcm-node');

const Server_key = 'AAAALCrvcUE:APA91bFbr2F3dTmwO4-zllN-1lcaqn6zzCb4Q2yy798_zxp298ObbagjUhdPOLSTT7OaMO8vQH8Dueodzkq_gVsyKi-BdbBNFesQ6SsCTHHAeqK-m5DAPfIwG65U4rrwk2Zz87WOLy2w';

const fcm = new FCM(Server_key);

const cron = require('node-cron');

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

    let priceCashFlow = dataUser.priceCashFlow;
    let countPost = dataUser.countPost;
    let content = '';

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

    if (parseInt(req.body.priceAll) > 0) {
      const dataCashFlow = {
        idUser: req.body.idUser,
        title: 'Thông báo biến động số dư',
        content: content,
        price: req.body.priceAll,
        dateTime: hours + ':' + minutes + ' ' + date + '-' + month + '-' + year,
        status: false
      };
      await new cashFlow(dataCashFlow).save();

      const dataCashFlowAdmin = {
        idUser: '645efe1c14300b577a70bde5',
        title: 'Khách Hàng Thanh Toán: ' + dataUser.fullname,
        content: content,
        price: req.body.priceAll,
        dateTime: hours + ':' + minutes + ' ' + date + '-' + month + '-' + year,
        status: true,
        timeLong: ts
      };
      await new cashFlow(dataCashFlowAdmin).save();

      // update Tiền admin
      const dataUserAdmin = await User.findById('645efe1c14300b577a70bde5');
      let priceCashFlowAdmin = dataUserAdmin.priceCashFlow;
      await User.findOneAndUpdate({ _id: '645efe1c14300b577a70bde5' }, { priceCashFlow: priceCashFlowAdmin += parseInt(req.body.priceAll) }, { new: true });
    }

    const saveData = await new post(data).save();
    res.status(200).json(formatResponseSuccess(saveData, true, 'Đăng thành công, bài viết của bạn đang trong quá trình phê duyệt'));
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Đăng bài thất bại'));
  }
}

async function updateDataAfterDays(req, res) {
  cron.schedule(`0 0 */${parseInt(req.params.day)} * *`, async () => {
    try {
      const data = {
        advertisement: false
      };
      const dataUpdate = await post.updateOne({ _id: req.params.id }, data);
      res.status(200).json('Đã Cập Nhật');
      console.log(`Đã cập nhật quảng caáo. id ${req.params.id}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật dữ liệu:', error);
    }
  });
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


async function getListHomeAds(req, res) {
  try {
    const filter = {
      statusConfirm: true, advertisement: true
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

    const dataPost = await post.findById(req.params.id);

    const dataUpdate = await post.updateOne({ _id: req.params.id }, data);
    res.status(200).json(formatResponseSuccess(dataUpdate, true, 'Phê duyệt thành công'));

    const dataUserPost = await User.findOne({ _id: dataPost.idUser });
    console.log(dataUserPost);
    const message = {
      to: dataUserPost.tokenDevice,
      notification: {
        title: 'Thông báo',
        body: 'Bài viết của bạn đã được chúng tôi phê duyệt',
        sound: 'default'
      },
      data: {
        title: 'Thông báo',
        body: 'Bài viết của bạn đã được chúng tôi phê duyệt',
        idPost: dataPost._id,
        image: dataPost.images[0],
        type: 4
      },
      android: {
        'priority': 'high'
      }
    };
    const dataNewNoti = {
      idPost: dataPost._id,
      idUser: dataPost.idUser,
      title: 'Thông báo',
      content: 'Bài viết của bạn đã được chúng tôi phê duyệt',
      imagePost: dataPost.images[0],
      timeLong: Date.now(),
      type: 4
    };
    fcm.send(message, function(err, response) {
      if (err) {
        console.log('Bắn Lỗi ' + err);
      } else {
        console.log('Bắn thành công');
      }
    });
    await new notification(dataNewNoti).save();

  } catch (e) {
    console.log(e);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Update Failed'));
  }
}

// huỷ bài viết
async function cancelPostByAdmin(req, res) {
  try {
    const data = {
      statusConfirm: false, messageConfirm: 'Bài viết bị huỷ', textConfirm: req.body.textConfirm
    };
    const dataPost = await post.findById(req.body.id);

    const dataUpdate = await post.updateOne({ _id: req.body.id }, data);
    res.status(200).json(formatResponseSuccess(dataUpdate, true, 'Huỷ thành công'));

    const dataUserPost = await User.findOne({ _id: dataPost.idUser });
    const message = {
      to: dataUserPost.tokenDevice,
      notification: {
        title: 'Thông báo',
        body: 'Chúng tôi đã từ chối bài viết của bạn, lí do: ' + req.body.textConfirm,
        sound: 'default'
      },
      data: {
        title: 'Thông báo',
        body: 'Chúng tôi đã từ chối bài viết của bạn, lí do: ' + req.body.textConfirm,
        idPost: dataPost._id,
        image: dataPost.images[0],
        type: 4
      },
      android: {
        'priority': 'high'
      }
    };

    const dataNewNoti = {
      idPost: dataPost._id,
      idUser: dataPost.idUser,
      title: 'Thông báo',
      content: 'Chúng tôi đã từ chối bài viết của bạn, lí do: ' + req.body.textConfirm,
      imagePost: dataPost.images[0],
      timeLong: Date.now(),
      type: 4
    };

    fcm.send(message, function(err, response) {
      if (err) {
        console.log('Bắn Lỗi ' + err);
      } else {
        console.log('Bắn thành công');
      }
    });
    const saveOrder = await new notification(dataNewNoti).save();

  } catch (e) {
    console.log(e);
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
      dateEdit: date + '/' + month + '/' + year
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
      statusRoom: req.body.statusRoom,
      messageRoom: req.body.messageRoom,
      statusEdit: true,
      timeEdit: hours + ':' + minutes,
      dateEdit: date + '/' + month + '/' + year
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

async function userViewPost(req, res) {
  try {
    const dataPost = await post.findById({ _id: req.body.idPost }); // Lấy thông tin bài đăng từ ID
    if (!post) {
      console.log('Không tìm thấy bài đăng');
      return;
    }
    if (!dataPost.views.includes(req.body.idUser)) {
      dataPost.views.push(req.body.idUser);
      dataPost.viewsCount++;
      await dataPost.save();
      res.status(200).json('okoko');
    } else {
      res.status(200).json('Người dùng đã xem bài đăng trước đó');
    }
  } catch (error) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Lỗi khi cập nhật số lượng người dùng xem bài đăng'));
  }
}

async function searchLocationAndPost(req, res) {

  try {
    const dataCompile = [];
    const dataLoaction = [
      { titlePost: 'An Giang', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bà Rịa - Vũng Tàu', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bạc Liêu', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bắc Giang', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bắc Kạn', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bắc Ninh', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bến Tre', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bình Dương', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bình Định', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bình Phước', address: 'Địa điểm', type: 1 },
      { titlePost: 'Bình Thuận', address: 'Địa điểm', type: 1 },
      { titlePost: 'Cà Mau', address: 'Địa điểm', type: 1 },
      { titlePost: 'Cao Bằng', address: 'Địa điểm', type: 1 },
      { titlePost: 'Cần Thơ', address: 'Địa điểm', type: 1 },
      { titlePost: 'Đà Nẵng', address: 'Địa điểm', type: 1 },
      { titlePost: 'Đắk Lắk', address: 'Địa điểm', type: 1 },
      { titlePost: 'Đắk Nông', address: 'Địa điểm', type: 1 },
      { titlePost: 'Điện Biên', address: 'Địa điểm', type: 1 },
      { titlePost: 'Đồng Nai', address: 'Địa điểm', type: 1 },
      { titlePost: 'Đồng Tháp', address: 'Địa điểm', type: 1 },
      { titlePost: 'Gia Lai', address: 'Địa điểm', type: 1 },
      { titlePost: 'Hà Giang', address: 'Địa điểm', type: 1 },
      { titlePost: 'Hà Nam', address: 'Địa điểm', type: 1 },
      { titlePost: 'Hà Nội', address: 'Địa điểm', type: 1 },
      { titlePost: 'Hà Tĩnh', address: 'Địa điểm', type: 1 },
      { titlePost: 'Hải Dương', address: 'Địa điểm', type: 1 },
      { titlePost: 'Hải Phòng', address: 'Địa điểm', type: 1 },
      { titlePost: 'Hậu Giang', address: 'Địa điểm', type: 1 },
      { titlePost: 'Hòa Bình', address: 'Địa điểm', type: 1 },
      { titlePost: 'Thành phố Hồ Chí Minh', address: 'Địa điểm', type: 1 },
      { titlePost: 'Hưng Yên', address: 'Địa điểm', type: 1 },
      { titlePost: 'Khánh Hòa', address: 'Địa điểm', type: 1 },
      { titlePost: 'Kiên Giang', address: 'Địa điểm', type: 1 },
      { titlePost: 'Kon Tum', address: 'Địa điểm', type: 1 },
      { titlePost: 'Lai Châu', address: 'Địa điểm', type: 1 },
      { titlePost: 'Lạng Sơn', address: 'Địa điểm', type: 1 },
      { titlePost: 'Lào Cai', address: 'Địa điểm', type: 1 },
      { titlePost: 'Lâm Đồng', address: 'Địa điểm', type: 1 },
      { titlePost: 'Long An', address: 'Địa điểm', type: 1 },
      { titlePost: 'Nam Định', address: 'Địa điểm', type: 1 },
      { titlePost: 'Nghệ An', address: 'Địa điểm', type: 1 },
      { titlePost: 'Ninh Bình', address: 'Địa điểm', type: 1 },
      { titlePost: 'Ninh Thuận', address: 'Địa điểm', type: 1 },
      { titlePost: 'Phú Thọ', address: 'Địa điểm', type: 1 },
      { titlePost: 'Phú Yên', address: 'Địa điểm', type: 1 },
      { titlePost: 'Quảng Bình', address: 'Địa điểm', type: 1 },
      { titlePost: 'Quảng Nam', address: 'Địa điểm', type: 1 },
      { titlePost: 'Quảng Ngãi', address: 'Địa điểm', type: 1 },
      { titlePost: 'Quảng Ninh', address: 'Địa điểm', type: 1 },
      { titlePost: 'Quảng Trị', address: 'Địa điểm', type: 1 },
      { titlePost: 'Sóc Trăng', address: 'Địa điểm', type: 1 },
      { titlePost: 'Sơn La', address: 'Địa điểm', type: 1 },
      { titlePost: 'Tây Ninh', address: 'Địa điểm', type: 1 },
      { titlePost: 'Thái Bình', address: 'Địa điểm', type: 1 },
      { titlePost: 'Thái Nguyên', address: 'Địa điểm', type: 1 },
      { titlePost: 'Thanh Hóa', address: 'Địa điểm', type: 1 },
      { titlePost: 'Thừa Thiên Huế', address: 'Địa điểm', type: 1 },
      { titlePost: 'Tiền Giang', address: 'Địa điểm', type: 1 },
      { titlePost: 'Trà Vinh', address: 'Địa điểm', type: 1 },
      { titlePost: 'Tuyên Quang', address: 'Địa điểm', type: 1 },
      { titlePost: 'Vĩnh Long', address: 'Địa điểm', type: 1 },
      { titlePost: 'Vĩnh Phúc', address: 'Địa điểm', type: 1 },
      { titlePost: 'Yên Bái', address: 'Địa điểm', type: 1 }
    ];

    dataLoaction.forEach(async (l) => {
      if (l.titlePost.includes(req.params.textLocation)) {
        dataCompile.push(l);
      }
    });

    const regexName = { $regex: req.params.textLocation, $options: 'i' };

    const dataPostTitle = await post.find({
      statusConfirm: true,
      $or: [
        { title: regexName },
        { cty: regexName },
        { district: regexName },
        { wards: regexName },
        { street: regexName },
        { address: regexName }
      ]
    });

    dataPostTitle.forEach(async (item) => {
      const dataResponse = {
        idPost: item._id,
        titlePost: item.title,
        imagePost: item.images[0],
        address: item.cty + ', ' + item.district + ', ' + item.wards + ', ' + item.street + ', ' + item.address,
        type: 2
      };
      dataCompile.push(dataResponse);
    });

    res.status(200).json(dataCompile);
  } catch (error) {
    console.log(error);
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Error'));
  }
}

async function searchLocationCty(req, res) {
  try {
    const regexName = { $regex: req.params.textLocation, $options: 'i' };
    const filter = {
      statusConfirm: true,
      $or: [
        { title: regexName },
        { cty: regexName },
        { district: regexName },
        { wards: regexName },
        { street: regexName },
        { address: regexName }
      ]
    };
    const data = await post.find(filter);
    res.status(200).json(formatResponseSuccess(data.reverse(), true, 'Get Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

async function getFilterTextLocationAndPrice(req, res) {
  try {
    const regexName = { $regex: req.params.textLocation, $options: 'i' };
    const filter = {
      statusConfirm: true,
      price: {
        $gte: Number(req.params.startPrice) + 1,
        $lt: Number(req.params.endPrice) + 1
      },
      $or: [
        { title: regexName },
        { cty: regexName },
        { district: regexName },
        { wards: regexName },
        { street: regexName },
        { address: regexName }
      ]
    };
    const data = await post.find(filter);
    res.status(200).json(formatResponseSuccess(data.reverse(), true, 'Get Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

async function getFilterPrice(req, res) {
  try {
    const filter = {
      statusConfirm: true,
      price: {
        $gte: Number(req.params.startPrice) + 1,
        $lt: Number(req.params.endPrice) + 1
      }
    };
    const data = await post.find(filter);
    res.status(200).json(formatResponseSuccess(data.reverse(), true, 'Get Success'));
  } catch (e) {
    res.status(400).json(formatResponseError({ code: '404' }, false, 'Get Failed'));
  }
}

async function statistical(req, res) {
  try {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const filter = {
      timeLong: {
        $gte: startDate,
        $lt: endDate
      },
      _id: '645efe1c14300b577a70bde5'
    };
    const data = await cashFlow.find(filter);
    res.status(200).json(formatResponseSuccess(data.reverse(), true, 'Get Success'));
  } catch (e) {
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
  getStatusAds,
  getListHomeAds,
  userViewPost,
  searchLocationAndPost,
  searchLocationCty,
  getFilterTextLocationAndPrice,
  getFilterPrice,
  statistical,
  updateDataAfterDays
};