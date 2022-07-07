const mongoose=require("mongoose");
const ObjectId= mongoose.Schema.Types.ObjectId;
const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    excerpt:{
        type :String,
        required:true
    },
    ISBN:{
        type:String,
        required:true,
        unique:true

    },
    userId:{
        type:ObjectId,
        ref:"User",
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    subCategory:{
        type:[String],
        required:true,
        trim:true
    },
    reviews:{
        type:Number,
        default:0 ,
        trim : true
    },
    deletedAt:{
        type:Date,
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default:false,
        trim:true
    },
    releasedAt:{
        type:Date,
        default : Date.now   ///^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
    },    
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema)

//require moment karake and then use      
//  releasedAt: { type: moment(new Date()).format("YYYY-MM-DD"), required: true, default: null }


//releasedAt:moment(releasedAt).toISOString()
