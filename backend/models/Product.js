const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,

    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    
    },
    discountPrice:{
        type:Number,


    },
    countInStock:{
        type:Number,
        required:true,
        default:0,
    },
    sku:{
        type:String,
        unique:true,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    region:{
        type:String,
        required:true,
    },
    sizes:{
        type:[String],
        required:true
    },
    colors:{
        type:[String],
        required:true,
    },
    collections:{
        type:String,
        required:true,
    },
    material:{
        type:String,

    },
    images:[
    {
        src:{
            type:String,
            required:true,

        },
        alt:{
            type:String,
        }

    }],
    isFeatured:{
        type:Boolean,
        default:false,
    },
    isPublished:{
        type:Boolean,
        default:false,
    },
    rating:{
        type:Number,
        default:0,
    },
    numReviews:{
       type:Number,
       default:0,
    },
    tags:[String],
    user:{

        type:mongoose.Schema.Types.ObjectID,
        ref:"user",
        required:true,
    },
    metaTitle:{
        type:String,
    },
    metaDescription:{
        type:String,
    },
    metaKeywords:{
      type:String,
    },
    dimensions:{
        length:Number,
        width:Number,
        height:Number,
    },
    weight:Number,
    },
    {timestamps:true}

);

module.exports=mongoose.model("Product",productSchema);