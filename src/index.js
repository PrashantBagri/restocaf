import dotenv from "dotenv";
import app from "./app.js";
import ConnectDB from "./db/index.js";

dotenv.configDotenv({
    path : './.env'
})

ConnectDB().then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log("Server is listening on PORT : " ,process.env.PORT)
    })
}).catch((error)=>{
    console.log(error)
})