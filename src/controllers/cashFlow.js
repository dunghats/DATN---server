import { formatResponseError, formatResponseSuccess } from '../config';
import cashFlow from '../models/cashFlow';
import User from '../models/user';

async function createCashFlow(req, res) {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  try {
    let check = req.body.status;
    const dataUser = await User.findById({
      _id: req.body.idUser
    });
    let priceCashFlow = dataUser.priceCashFlow;

    console.log(dataUser.priceCashFlow + ' tiền cũ ');
    if (check) {
      console.log('check');
      const userUpdate1 = await User.findOneAndUpdate(
        { _id: req.body.idUser },
        { priceCashFlow: priceCashFlow += req.body.price},
        { new: true }
      );
    } else {
      console.log('check2');

      const userUpdate2 = await User.findOneAndUpdate(
        { _id: req.body.idUser },
        { priceCashFlow: priceCashFlow -= req.body.price },
        { new: true }
      );
    }

    console.log(dataUser.priceCashFlow + ' tiền mới ');

    const dataCashFlow = {
      idUser: req.body.idUser,
      title: req.body.title,
      content: req.body.content,
      price: req.body.price,
      dateTime: hours + ':' + minutes + ' ' + date + '-' + month + '-' + year,
      status: req.body.status
    };
    const saveCashFlow = await new cashFlow(dataCashFlow).save();

    res.status(200).json({
      status: true,
      message: 'Thêm thành công'
    });

  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      message: 'Thêm thất bại'
    });
  }
}

async function listCashFlow(req, res) {
  try {
    const data = await cashFlow.find({
      idUser: req.params.id
    })
    res.status(200).json(data.reverse())
  } catch (error) {
    res.status(404).json({
      status: false,
    })
  }
}


module.exports = {
  createCashFlow,listCashFlow
};