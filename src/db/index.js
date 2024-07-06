import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
import express from 'express';
import {mongoDBconnection} from '../errors/mongoDB.error.js'

const app = express();

const connectDB = async () => {
    try { 
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}?retryWrites=true&w=majority&appName=playtube`);
        console.log("The host is in MONGODB :",connectionInstance.connection.host);

        

    } catch (error) {
        console.log(`${mongoDBconnection}: ${error}`);
        process.exit(1);
    }
}

export default connectDB;