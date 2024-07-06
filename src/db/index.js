import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
import express from 'express';
import {mongoDBconnection} from '../errors/mongoDB.error.js'

const app = express();

const connectDB = async () => {
    try { 
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}?retryWrites=true&w=majority&appName=playtube`);
        console.log("The host is in MONGODB :",connectionInstance.connection.host);

        // app is not listening
        app.on('error',(err)=>{
            console.log('Error in talking to mongoDB : ',err);
            throw err;
        })


        app.listen(process.env.PORT || 8000 , ()=>{
            console.log(`App is listening on PORT : ${process.env.PORT}`);
        })

    } catch (error) {
        console.log(`${mongoDBconnection}: ${error}`);
        process.exit(1);
    }
}

export default connectDB;