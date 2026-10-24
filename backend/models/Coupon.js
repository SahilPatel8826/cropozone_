const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        uppercase:true,
    },
    discountType:{
        type:String,
        enum:["percentage","flat"],
        required:true,
    },
    discountValue:{
        type:Number,
        required:true,
        min:0,
    },
    // Upper limit on the discount (useful for percentage coupons)
    maxDiscount:{
        type:Number,
    },
    minOrderValue:{
        type:Number,
        default:0,
    },
    expiresAt:{
        type:Date,
    },
    usageLimit:{
        type:Number,
    },
    usedCount:{
        type:Number,
        default:0,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
},
{timestamps:true}
);

module.exports = mongoose.model("Coupon",couponSchema);
