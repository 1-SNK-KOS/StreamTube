import {asyncHandler} from '../utils/asyncHandler.js;'
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
// import { upload } from '../middlewares/multer.middleware.js';
import { uploadOnCloudinary } from "../utils/cloudinaryService.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const RegisterUser = asyncHandler( async (req,res)=> {
    //    res.status(200).json({
    //     message : "okay u got ur goal u r successful person"
    //    })

       /* Logic that required to have registerUser: 
        1. Get user details from frontened
        2. Validation - not empty , in correct format
        3. check if user already exits - email , username
        4. check for iimage , avatar
        5. upload them to cloudinary, avatar
        6. create user object - create entry in db
        7. remove password and refresh token from response
        8. Check for user creation
        9. return res
        */
          
        // 1st step
        const {username , fullName , email , password } = req.body;

        console.log(`The details of User \n Email : ${email} \n Username : ${username} \n fullName : ${fullName} \n password : ${password}  `);

        // if(fullName === ""){
        //     throw new ApiError;
        // }
        

        // 2nd Step
        if([fullName,username,email,password].some( (files) => files?.trim() === "" )){
            throw new ApiError(400," 😤 😰 All fields are complusory to fill !!! ")
        }

        // TODO   I will here make a condition to check the email is correct or not its syntax everything !!!!!
        // TODO  make a seprate file for validation check of various things like EMAIL 



        // 3rd Step
        const existedUser = User.findOne({
            $or : [{ username },{ email }]
        }
        )

        if(existedUser){
            throw new ApiError(409 , " Username or emails exits")
        }


        //4th step 
        const avatarLocalfilePath = req.files?.avatar[0]?.path;
        const coverImageLocalfilePath = req.files?.coverImage[0]?.path;

        if(!avatarLocalfilePath){
            throw new ApiError(409,"avatar file is required !!");
        }


        // 5th Step
         const avatar = await uploadOnCloudinary(avatarLocalfilePath);
         const coverImage = coverImageLocalfilePath === null
                            ?console.log("coverImage is not provided")
                            :await uploadOnCloudinary(coverImageLocalfilePath)

        // 6th Step 
       const UserInDB = await User.create({
            fullName,
            username : username.toLowerCase(),
            password,
            avatar : avatar.url,
            coverImage : coverImage?.url || ""
        })

        // to check whether user is created or not // 7th Step
        const UserCreated =  await User.findById(UserInDB._id).select(
            "-password -refreshToken"
        )

        // 8th Step
       
        if(!UserCreated){
            throw new ApiError(500,"Something went wrong while registering the User . Sorry for the Inconvience!!!");
        }

        //9th Step
        return res.status(201).json( 
            new ApiResponse(200,UserCreated,"User is successfully registered , you can move forward in Life 😂😂😂")
        )
})


export {RegisterUser};

