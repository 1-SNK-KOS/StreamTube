import {v2 as cloudinary} from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});


const deleteOldFilefromCloudinary = async (publicId) => {
  try {

    if(!publicId)return 'Error in publicId';

    const response = await cloudinary.uploader.destroy(publicId, {
        resource_type : auto
    }).then( (res) => {
        console.log("The previous file is deleted successfully !!!");
    }).catch( (err) => {
        console.log("Error in deleting previous existing file",err);
    })

    return response;


  } catch (error) {
    throw new ApiError(500,"Error is deleting the previous existing file")
  }
}


export { deleteOldFilefromCloudinary };