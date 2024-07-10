import { Router } from "express";
import { RegisterUser ,LogoutUser , refreshAccessToken , changeCurrentPassword , getCurrentUser , updateAccountDetails} from "../controller/user.controller.js";
import { LogInUser , updateUserAvatar , updateUsercoverImage , getUserChannelProfile , userWatchHistory } from "../controller/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
// here in btw we will import midddleware
router.route("/register").post(
    upload.fields(
         [
            {
                name : "avatar",
                maxCount : 1
            },
            {
                name : "coverImage",
                maxCount : 1
            }
         ]
    ),
    RegisterUser)

router.route("/login").post(LogInUser)

// secure routes
router.route("/logout").post(verifyJWT , LogoutUser)
router.route("refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT , changeCurrentPassword )
router.route("/current-user").get(verifyJWT , getCurrentUser )
router.route("/update-account").patch(verifyJWT , updateAccountDetails )
router.route("/avatar").patch(verifyJWT , upload.single("avatar") , updateUserAvatar )
router.route("/coverImage").patch(verifyJWT , upload.single("coverImage") , updateUsercoverImage )
router.route("/c/:username").get(verifyJWT , getUserChannelProfile ) 
//NOTE : the syntax for getting through url is in route "/<anyName>/:<same name as in destructing >"
router.route("/watchHistory").get(verifyJWT , userWatchHistory )



export default router;