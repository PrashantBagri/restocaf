import mongoose , {Schema} from "mongoose";

const dislikeSchema = Schema({
    likedBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    review : {
        type : Schema.Types.ObjectId,
        ref : "review"
    }
},  { timestamps : true });

export const Dislikes = mongoose.model("Dislikes", dislikeSchema);

