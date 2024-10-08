import mongoose from "mongoose";
import { DB_Name } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from './app.js'

// dotenve configuration
import dotenv from 'dotenv';
dotenv.config({
    path : './.env' // it doesn't create any error for ./env but the real should be ./and file name (.env)
})




connectDB()
.then(() => {
    // app is not listening
    app.on('error',(err)=>{
        console.log('Error in talking to mongoDB : ',err);
        throw err;
    })


    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`App is listening on PORT : ${process.env.PORT}`);
    })
})
.catch((err)=>{
  console.log('MONGODB conection failed !!!!!',err);
});



/*import express from 'express';

const app = express();


;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
         
        // if there is any error in listening the DB by our express
        app.on('error',(err)=>{
            console.log('Error in talking to mongoDB : ',err);
            throw err;
        })
        // if it is listening then this will run
        app.listen(process.env.PORT || 8000 , ()=>{
            console.log(`App is listening on PORT : ${process.env.PORT}`);
        })
    } catch (error) {
        console.log('ERROR in connecting to database : ',error);
    }
})()
*/
