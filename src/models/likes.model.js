import mongoose , {Schema} from "mongoose";

const likeSchema = Schema({
    likedBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    review : {
        type : Schema.Types.ObjectId,
        ref : "review"
    }
},  { timestamps : true });

export const Likes = mongoose.model("Likes", likeSchema);

