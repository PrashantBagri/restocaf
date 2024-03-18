import dotenv from "dotenv";
import app from "./app.js";
import ConnectDB from "./db/index.js";

dotenv.configDotenv({
    path : './.env'
})

ConnectDB().then(()=>{
    app.listen(process.env.PORT  , ()=>{
        console.log("Server is listening on PORT : " ,process.env.PORT)
    })
}).catch((error)=>{
    console.log("Error while connecting to express server : ", error)
    process.exit(1)
})