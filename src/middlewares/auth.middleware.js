import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler( async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","");

        // console.log("\n\n\n✨✨✨✨✨✨ THe information about req.header :: ",req.header);
        
        if(!token){
            throw new ApiError(401,"Unauthorized request");
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

         console.log(decodedToken);
         
        const userLoggedIn = await User.findById(decodedToken._id).select(
            "-password -refreshToken"
        )
        
        if(!userLoggedIn){
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = userLoggedIn;
        next();

    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }
})

