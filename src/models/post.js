import mongoose from 'mongoose';

const post = mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  nameCategory: {
    type: String
  },
  title: {
    type: String
  },
  images: [],
  cty: {
    type: String
  },
  district: {
    type: String
  },
  // xã
  wards: {
    type: String
  },
  street: {
    type: String
  },
  // địa chỉ cụ thể
  address: {
    type: String
  },
  // diện tích
  acreage: {
    type: String
  },
  // đặt cọc
  deposit: {
    type: Number
  },
  bedroom: {
    type: Number
  },
  bathroom: {
    type: Number
  },
  countPerson: {
    type: Number
  },
  //ngày có thể vào ở
  startDate: {
    type: String
  },
  // gía phòng
  price: {
    type: Number
  },
  electricityPrice: {
    type: Number
  },
  waterPrice: {
    type: Number
  },
  wifi: {
    type: Number
  },
  // mô tả
  describe: {
    type: String
  },
  phone: {
    type: String
  },
  supplements: Array,
  time: {
    type: String
  },
  date: {
    type: String
  },
  statusConfirm: {
    type: Boolean,
    default: false
  },
  messageConfirm: {
    type: String,
    default: 'Đang chờ duyệt bài'
  },
  // trường hợp từ chốt duyệt bài viết
  textConfirm: {
    type: String,
    default: ''
  },

  // trường hợp người cho thuê muốn cập nhật trạng thái bài viết là còn phòng hay không
  statusRoom: {
    type: Boolean,
    default: true
  },
  messageRoom: {
    type: String,
    default: 'Còn phòng'
  },

  // trường hợp người cho thuê cập nhật bài viết và người đi thuê có thể thấy điều này
  // edit
  statusEdit: {
    type: Boolean,
    default: false
  },
  timeEdit: {
    type: String,
    default: ''
  },
  dateEdit: {
    type: String,
    default: ''
  }
});

export default mongoose.model('post', post);