import { Router } from "express";
import { RegisterUser } from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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


export default router;