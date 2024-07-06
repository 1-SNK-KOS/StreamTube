import {asyncHandler} from '../utils/asyncHandler.js'


const RegisterUser = asyncHandler( async (req,res)=> {
       res.status(200).json({
        message : "okay u got ur goal u r successful person"
       })
})


export {RegisterUser};