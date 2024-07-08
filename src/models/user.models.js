import mongoose,{Schema} from "mongoose";
import { model } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = Schema({
    username : {
        type : String,
        unique : true,
        lowercase : true,
        trim : true,
        required : true,
        index : true
    },
    email : {
        type : String,
        unique : true,
        lowercase : true,
        trim : true,
        required : true,
    },
    fullName : {
        type : String,
        trim : true ,
        required : true,
        index : true
    },
    avatar : {
        type : String ,// cloudinay url
        required : true
    },
    coverImage : {
        type : String ,// cloudinay url
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Video'
        }
    ],
    password : {
        type : String,
        reqired : [true, 'Password is required']
    },
    refreshToken : {
        type : String
    }
},{timestamps : true});

// to encrypt password just before saving in database
userSchema.pre('save',async function(next){
     
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);  // return true or false
}

userSchema.methods.generateAccessToken = function(){
     return jwt.sign(
        {
            _id: this._id,
            username : this.username,
            email : this.email,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model('User',userSchema);