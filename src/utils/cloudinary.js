import {v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: 'dunimt9nd', 
  api_key: '377864415194822', 
  api_secret: 'KNQhKDA6STPTM3jV9QvLh4Dg5cA' 
});

const uploadOnCloud = async (localFilePath) =>{
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"image"
        })
        console.log("Successfully Uploaded files.");
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null
    }
}

export {uploadOnCloud}