import {v2 as cloudinay} from 'cloudinary'
import fs from 'fs'

cloudinay.config({
   cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
   api_key : process.env.CLOUDINARY_API_KEY,
   api_secret : process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localfilePath) => {
    try {
        if(!localfilePath)return 'Error in localfilePath';

        // upload the file in cloudinary
        const response = await cloudinay.uploader.upload(localfilePath,{
            resource_type : "auto"
        })

        // file has been uploaded
        console.log("File is uploaded successfully on cloudinary : ",response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localfilePath);
        console.log("file is deleted from local server");

        return "file is deleted from local server";
    }
}


export {uploadOnCloudinary};




/*import { v2 as cloudinary } from 'cloudinary';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dny9km72p', 
        api_key: '113627664171252', 
        api_secret: '<your_api_secret>' // Click 'View Credentials' below to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();*/