import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index:true,
      trim : true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      trim: true
    },
    city: {
      type: String,
    },
    password: {
      type: String,
      required : true
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    likes : {
      type : Schema.Types.ObjectId,
      ref : "Likes"
    },
    dislikes : {
      type : Schema.Types.ObjectId,
      ref : "Dislikes"
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function(){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(this.password, password)
}

userSchema.methods.generateAccessToken= async function(){
  return await jwt.sign(
    {
      _id : this._id,
      username : this.username,
      email : this.email,
    },
    process.env.ACCESSTOKEN_SECRET,
    {
      expiresIn: process.env.ACCESSTOKEN_EXPIRY
    }
  )

}

userSchema.methods.generateRefreshToken = async function(){
  return await jwt.sign(
    {
      id : this._id,
    },
    process.env.REFRESHTOKEN_SECRET,
    {
      expiresIn : process.env.REFRESHTOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema);