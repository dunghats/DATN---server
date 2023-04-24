import supplements from '../models/supplements';

async function addSupplements(req, res) {
  try {
    const data = {
      name: req.body.name,
      iconImage: req.body.iconImage
    };
    const saveData = await new supplements(data).save();
    res.status(200).json({
      saveData,
      message: 'true'
    });
  } catch (error) {
    res.status(400).json({
      message: 'false'
    });
  }
}

async function getAllSupplements(req, res) {
  try {
    const data = await supplements.find();
    res.status(200).json({
      message: 'true',
      data: data
    });
  } catch (error) {
    res.status(400).json({
      message: 'false'
    });
  }
}

async function getListSupplementsById(req, res) {
  try {
    const data = await supplements.findOne({ _id: req.params.id }).exec();
    res.status(200).json({
      message: 'true',
      data: data
    });
  } catch (error) {
    res.status(400).json({
      // error
      message: 'false'
    });
  }
}

module.exports = {
  getListSupplementsById, getAllSupplements, addSupplements
};