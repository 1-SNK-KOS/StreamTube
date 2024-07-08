import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
// import { upload } from '../middlewares/multer.middleware.js';
import { uploadOnCloudinary } from "../utils/cloudinaryService.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler  } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"



// Method for Generating A&R TOken
const generateAccessRefreshToken = async (userId) => {
    try {

        const userDetails = await User.findById(userId);
        const AccessToken = userDetails.generateAccessToken();
        const RefreshToken = userDetails.generateRefreshToken();
       
        // console.log("Helllo Hi ",AccessToken , RefreshToken);



        userDetails.refreshToken = RefreshToken;
        await userDetails.save({validateBeforeSave : false})

        return { AccessToken , RefreshToken };

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Access & Refresh token ");
    }
}

const RegisterUser = asyncHandler( async (req,res)=> {
    //    res.status(200).json({
    //     message : "okay u got ur goal u r successful person"
    //    })

    // console.log("\n\n\n✨✨✨✨✨✨ THe information about req :: ",req);
    // console.log("\n\n\n✨✨✨✨✨✨ THe information about req :: ",res);


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
        // console.log("\n\n✨✨✨✨✨✨ THe information about req.body:: ",req.body);
        // console.log(`The details of User \n Email : ${email} \n Username : ${username} \n fullName : ${fullName} \n password : ${password}  `);

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
        const existedUser = await User.findOne({
            $or : [{ username },{ email }]
        }
        )

        if(existedUser){
            throw new ApiError(409 , " Error :: !!! Username or emails exits while finding in Database")
        }


        //4th step 
        // console.log("\n\n✨✨✨✨✨✨ THe information about req.files :: ",req.files);
        const avatarLocalfilePath = req.files?.avatar[0]?.path;
        // const coverImageLocalfilePath = req.files?.coverImage[0]?.path;
        let  coverImageLocalfilePath;

        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
            coverImageLocalfilePath = req.files.coverImage[0].path;
        }

        if(!avatarLocalfilePath){
            throw new ApiError(409,"avatar file is required !!");
        }


        // 5th Step
         const avatar = await uploadOnCloudinary(avatarLocalfilePath);
         const coverImage = coverImageLocalfilePath === undefined
                            ?console.log("coverImage is not provided")
                            :await uploadOnCloudinary(coverImageLocalfilePath)

        // console.log("\n\n\n✨✨✨✨✨✨ THe information about avatar after oploading in cloudinary :: ",avatar);
        

        // 6th Step 
       const UserInDB = await User.create({
            fullName,
            email,
            username : username.toLowerCase(),
            password,
            avatar : avatar.url,
            coverImage : coverImage?.url || ""
        })
        
    //    console.log("\n\n\n✨✨✨✨✨✨ THe information about user after created in database :: ",UserInDB);

        // to check whether user is created or not // 7th Step
        const UserCreated =  await User.findById(UserInDB._id).select(
            "-password -refreshToken"
        )


        // console.log("\n\n\n✨✨✨✨✨✨ THe information about userCreated :: ",UserCreated);

        // 8th Step
       
        if(!UserCreated){
            throw new ApiError(500,"Something went wrong while registering the User . Sorry for the Inconvience!!!");
        }

        //9th Step
        return res.status(201).json( 
            new ApiResponse(200,UserCreated,"User is successfully registered , you can move forward in Life 😂😂😂")
        )
})

const LogInUser = asyncHandler( async (req,res) => {
    /* 1. req.body -> data
       2. username or email
       3. find the user
       4. password check
       5. access & refresh token
       6. return res  and cookie
    */

    // 1st Step
    const {username,password,email} = req.body;

    // if([username,email,password].some((field)=>field?.trim() === "")){
    //     throw new ApiError(400 ," 😤 😰 All fields are complusory to fill !!! ");
    // }

    //2nd Step

    if(!(username && email && password)){
        throw new ApiError(400," !!!!!  All fields are required !!!");
    }
   
     // 3rd Step
    //  console.log(`USername : ${username} \n email : ${email} \n password : ${password}`);
    const userDB = await User.findOne({
        $or : [{username} , {email}]
    })

    // console.log("\n", userDB);
    
    if(!userDB){
        throw new ApiError(400,"User is not register !!!");
    }

    // 4th Step

    const isPasswordValid = await userDB.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials");
    }

    // 5th Step

    const { AccessToken , RefreshToken } = await generateAccessRefreshToken(userDB._id);
    
    // console.log("\n\nInside Login",AccessToken , RefreshToken);
    
    // userDB.refreshToken = RefreshToken;

   const LoggedInUser =   await User.findById(userDB._id).select(
    "-password -refreshToken"
   )

   // 6th Step 
   const options = {
    httpOnly : true,
    secure : true
   }
   
   return res .status(200)
              .cookie("accessToken" , AccessToken , options)
              .cookie("refreshToken" , RefreshToken , options)
              .json(
                200,
                {
                    user : LoggedInUser , AccessToken , RefreshToken
                },
                "User is logged in successfully"
              )
 
})

const LogoutUser = asyncHandler( async(req,res) => {
    // cookie and token are discarded from userbrowser 
    // R.T from DB is discarded too
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {refreshToken : undefined}
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }
    
    return res.status(200)
              .clearCookie("accessToken",options)
              .clearCookie("refreshToken",options)
              .json(
                new ApiResponse(200,{},"User is Logout Successfully")
              )
    
})

const refreshAccessToken = asyncHandler( async (req,res) => {
    const cookieRefreshToken = req.cookies?.refreshToken ||   req.body.refreshToken;

    if(!cookieRefreshToken){
        throw new ApiError(401,"Unauthorized request");
    }
try {
    
        const decodedToken = jwt.verify(cookieRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const userDB = await User.findById(decodedToken?._id)
    
        if(!userDB){
            throw new ApiError(401 , "Invalid Refresh Token");
        }
    
        if(cookieRefreshToken !== userDB.refreshToken){
            throw new ApiError(401,"Refresh Token is either expired or used");
        }
    
        const { AccessToken , newRefreshToken } = generateAccessRefreshToken(userDB._id);
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        return res.status(200)
                  .cookie("accessToken" , AccessToken , options)
                  .cookie("refreshToken" , RefreshToken , options)
                  .json(
                       new ApiResponse(200,{AccessToken,refreshToken : newRefreshToken},"Access Token is Refresh")
                    )
} catch (error) {
    new ApiError(401,error?.message || "Invalid Refresh TOken")
}
})

export { RegisterUser , LogInUser , LogoutUser , refreshAccessToken };

