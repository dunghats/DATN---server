import mongoose, { Schema } from "mongoose";

const messageSchema = mongoose.Schema(
  {
    message:{
      text:{
        type:String,
        required:true
      }
    },
    user:Array,
    send:{
      type:Schema.Types.ObjectId,
      ref:"user",
      required:true
    },
    sendTo:{
      type:String
    },
    time_send:{
      type:String
    },
    status:{
      type:Boolean
    }
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Message",messageSchema)