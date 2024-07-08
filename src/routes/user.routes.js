import { Router } from "express";
import { RegisterUser ,LogoutUser , refreshAccessToken } from "../controller/user.controller.js";
import { LogInUser } from "../controller/user.controller.js"
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



export default router;