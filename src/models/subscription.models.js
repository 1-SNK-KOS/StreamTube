import mongoose , { Schema } from "mongoose";


const subscriptionSchema = new Schema({
    subscribe : {
        type : Schema.Types.ObjectId, // the user who is subscribing
        ref : "User"
    },
    channel : {
        type : Schema.Types.ObjectId, // the subscriber who has subscribe other subscriber's channel
        ref : "User"
    }
},{timestamps : true})


export const Subscription = mongoose.model("Subscription",subscriptionSchema); 