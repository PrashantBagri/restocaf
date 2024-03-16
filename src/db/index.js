import mongoose from "mongoose";

const ConnectDB = async () =>{
    try {   
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`);
        console.log("MongoDB connected, DB Host : ", connectionInstance.connection.host);
    } catch (error) {
        console.log("MongoDB Connection Error : ", error)
        process.exit(1)
    }
}

export default ConnectDB;