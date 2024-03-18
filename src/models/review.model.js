import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Likes",
    },
  ],
  dislikes: [
    {
      type: Schema.Types.objectID,
      ref: "dislikes",
    },
  ],
  store : {
    type : Schema.Types.ObjectId,
    ref : "store"
  },
  reviewer :{
    type : Schema.Types.ObjectId,
    ref : "User"
  }

}, { timestamps : true });


export const Review = mongoose.model("Review", reviewSchema);
