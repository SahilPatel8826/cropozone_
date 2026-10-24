const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    comment:{
        type:String,
        trim:true,
        maxLength:1000,
    },
    isVerifiedPurchase:{
        type:Boolean,
        default:false,
    },
},
{timestamps:true}
);

// One review per user per product
reviewSchema.index({product:1,user:1},{unique:true});

module.exports = mongoose.model("Review",reviewSchema);
