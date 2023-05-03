import mongoose, { Schema } from 'mongoose'
const favouriteSchema = mongoose.Schema(
  {
    idUser: {
      type: String,
    },
    idPost:{
      type: String,
    },
    isCheck: {
      type: Boolean,
      default: true
    }
  }
)

export default mongoose.model("favourite" , favouriteSchema)