const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({ 
    
        bookId: {
            type: ObjectId,
            required: true,
            ref: "Book",
            trim:true
        },
        reviewedBy: {
            type: string,
            required: true,
            default: "Guest",
            trim:true
        },
        reviewedAt: {
            type: Date,
            required: true,
            trim:true
        },
        rating: {
            type: Number,
            minlength: "1",
            maxlength: "5",
            required: true,
            trim:true
        },
        review: {
            type: String,
            trim:true
        },
        isDeleted: {
            type: Boolean,
            default: false,
            trim:true
        },


    }, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema)
