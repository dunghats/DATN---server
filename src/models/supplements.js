import mongoose from 'mongoose'

const supplementSchema = mongoose.Schema({
  name: {
    type: String,
  },
  iconImage: {
    type: String,
  },
})

export default mongoose.model('supplements', supplementSchema)