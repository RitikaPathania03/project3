const reviewModel=require("../module/reviewModel");
const bookModel=require("../model/bookModel")
const ObjectId = require('mongoose').Types.ObjectId

const isValid = function (value) {
    if ( value === "undefined" || value === null) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true
}




const reviews=async function (req,res){
    try{
    let bookId=req.params.bookId
    let reviewsData=req.body
    let{reviewedBy, rating, review, ...rest}=req.body
    //check body is empty or not
    if(!Object.keys(reviewsData).length) return res.status(400).send({status:false,message:"Please Enter the Data in Request Body"})
    //check if any unwanted keys present or 
    if(Object.keys(rest).length > 0) return res.status(400).send({status:false,message:"Please Enter the Valid Attribute Field "})
    //check if bookid is present or not ie req.body
    if(!reviewedBy) return res.status(400).send({status:false, message:"please enter reviewedBy"})//ask to TA if it is mendetory or not
    //check if reviewedBy is present or not ie req.body
    if(!bookId) return res.status(400).send({status:false, message:"please enter bookId in params"})
   
    if(!rating) return res.status(400).send({status:false, message:"please enter rating"})

    if (typeof rating !== Number) { res.status(400).send({ msg: 'rating should be number type' }) }

    //check the bookId is Valid or Not ?
    
    if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "bookId is Invalid" });
    //check  reviewedBy is valid or not
    // let regName=/^[a-zA-Z]$/
    if(!/^[a-zA-Z]{2,30}$/.test(reviewedBy)) return res.status(400).send({ status: false, msg: "reviewedBy is Invalid" });
    //check  rating is valid or not
    if(!/^[1-5]$/.test(rating)) return res.status(400).send({ status: false, msg: "rating is Invalid" });
    // check  review is valid or not
    if(!/^[a-zA-Z]+/.test(review))  return res.status(400).send({ status: false, msg: "review is Invalid" });
    //check bookId is present or not in DB

    let book=await bookModel.findById(bookId)
    if(!book || book.isDeleted==true) return res.status(404).send({status:false, message:"book is not present in DB"})
       
    const releasedDate = new Date();
    
    const responseBody = {
        bookId: bookId,
        reviewedBy: reviewedBy,
        rating: rating,
        reviewedAt: releasedDate,
        review: review,
    };
    //add data in reviews
       
     
    let savedData = await reviewModel.create(responseBody)
    //finding that created review with reviewId
    const findReviewId = await reviewModel
    .findById( savedData._id)
    .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 });

    res.status(201).send({status:true, message:"Success", data :findReviewId })
    //finding book with bookId and updting its review count
    const udatedBookReview = await bookModel.findOneAndUpdate(
    { _id: bookId },
    { $inc: { reviews: 1 }, }
    );
    } catch (err) {
    res.status(500).send({ msg: err.message });
    }
    }


const updateReview= async function(req,res){
    try{
     let newData=req.body;
     let bookId=req.params.bookId;
     let reviewId=req.params.reviewId;

     let{reviewedBy, rating, review, ...rest }= newData 
     if(!Object.keys(newData).length) return res.status(400).send({status:false,message:"Please Enter the Data in Request Body"})
     if(!Object.keys(req.params).length) return res.status(400).send({status:false,message:"Please Enter the Data in params"})
     if(!Object.keys(bookId).length) return res.status(400).send({status:false,message:"Please Enter some bookId in params"})
     if(!Object.keys(reviewId).length) return res.status(400).send({status:false,message:"Please Enter some reviewId in params"})


     let findBook=await bookModel.findOne(bookId, isDeleted=false);
     if(!findBook){res.status(400).send({status:false},{msg:"No such book exists or is deleted"})}
     let findReview=await reviewModel.findOne(reviewId, isDeleted=false);
     if(!findReview){res.status(400).send({status:false},{msg:"No such review exists or is deleted"})}

     if(!findBook==findReview){res.status(400).send({status:false},{msg:"the review doesnt belong to this book or vice versa,change the given id"})}

     if(reviewedBy){if(typeof reviewedBy !== 'string') { res.status(400).send({ msg: 'reviewedBy should be string type' }) };     
     findReview.reviewedBy=reviewedBy;}

     if(rating){if(!/^[1-5]$/.test(rating)) return res.status(400).send({ status: false, msg: "rating is Invalid" });
    
     findReview.rating=rating;}

     if(review){if(!/^[a-zA-Z]+/.test(review))  return res.status(400).send({ status: false, msg: "review is Invalid" });
     findReview.review=review;}

     if(rest){res.status(400).send({status:false,msg:"Only reviewedBy or rating or review can be updated"})}
      
      
     let updatedData=await reviewModel.findOneAndUpdate(reviewId,findReview,{new:true});
     res.status(201).send({status:true, msg:"success",data:updatedData });
     }catch(err){res.status(500).send({status:false, msg: 'SERVER ERROR', error: err.message });
    }
    };
     
   
module.exports.reviews=reviews;
module.exports.updateReview=updateReview;