const reviewModel=require("../model/reviewModel");
const bookModel=require("../model/bookModel")
const ObjectId = require('mongoose').Types.ObjectId

const isValid = function (value) {
    if ( value === "undefined" || value === null) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true
}




const reviews=async function (req,res){
    try{
    let bookId=req.params.bookId;
    if(!bookId) return res.status(400).send({status:false, message:"please enter bookId in params"})
    let reviewsData=req.body;
    let {reviewedBy, rating, review, ...rest}=req.body
    //check body is empty or not
    if(!Object.keys(reviewsData).length) return res.status(400).send({status:false,message:"Please Enter the Data in Request Body"})
    //check if any unwanted keys present or 
    if(Object.keys(rest).length > 0) return res.status(400).send({status:false,message:"Please Enter the Valid Attribute Field "})
    //check if bookid is present or not ie req.body
    if(!reviewedBy) return res.status(400).send({status:false, message:"please enter reviewedBy"})//ask to TA if it is mendetory or not
    //check if reviewedBy is present or not ie req.body   
    if(!rating) return res.status(400).send({status:false, message:"please enter rating"})

   // if (typeof rating !== Number) { res.status(400).send({ msg: 'rating should be number type' }) }

    //check the bookId is Valid or Not ?
    
    if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "bookId is Invalid" });
    //check  reviewedBy is valid or not
    // let regName=/^[a-zA-Z]$/
    if(!/^[a-zA-Z\s]*$/.test(reviewedBy)) return res.status(400).send({ status: false, msg: "reviewedBy is Invalid" });
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



const updateReview = async function (req, res) {
    try {
        // Stores the blog id data recieved in params in to a new variable
    let bookId = req.params.bookId;
    if(!Object.keys(bookId).length) return res.status(400).send({status:false,message:"Please Enter some bookId in params"})

    let reviewId=req.params.reviewId;
    let newData=req.body;
    let {reviewedBy, rating, review, ...rest }=newData;

   // if(!Object.keys(bookId).length) return res.status(400).send({status:false,message:"Please Enter some bookId in params"})
    if(!Object.keys(reviewId).length) return res.status(400).send({status:false,message:"Please Enter some reviewId in params"})
    if(!Object.keys(req.body).length) return res.status(400).send({status:false,message:"Please Enter the Data in Request Body"})
    if(!Object.keys(req.params).length) return res.status(400).send({status:false,message:"Please Enter the Data in params"})
    if(reviewedBy){if(!/^[a-zA-Z\s]*$/.test(reviewedBy))  return res.status(400).send({ status: false, msg: "reviewBy should be in alphabets" })};
    if(review){if(!/^[a-zA-Z]+/.test(review))  return res.status(400).send({ status: false, msg: "review should be in letters" })};
    if(rating){if(!/^[1-5]$/.test(rating)) return res.status(400).send({ status: false, msg: "rating should be between 1 and 5" })};
    if(Object.keys(rest).length>0) return res.status(400).send({status:false,message:"Only reviewedBy or rating or review can be updated"})

    let findBook=await bookModel.findOne({_id:bookId, isDeleted:false});
    if(!findBook){res.status(400).send({status:false,msg:"No such book exists or is deleted"})}
    let findReview=await reviewModel.findOne({_id:reviewId, isDeleted:false});
    if(!findReview){res.status(400).send({status:false,msg:"No such review exists or is deleted"})}
        
    if(findReview.bookId!=bookId){ res.status(400).send({status:false,msg:"the review doesnt belong to this book or vice versa,change the given id"})}
             
    let updateData = await reviewModel.findByIdAndUpdate(reviewId, {
    review: review, 
    rating: rating,
    reviewedBy :reviewedBy,
       
    }, { new: true })
    return res.status(200).send({ status: true,msg:"Success", data: updateData })
        
    }
    catch (err) {
    return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })
    }
    };


const deleteReview=async function(req,res){
    try{
    if(!Object.keys(req.params).length) return res.status(400).send({status:false,message:"Please Enter the Data in params"})
    let bookId=req.params.bookId;
    if(!Object.keys(bookId).length) return res.status(400).send({status:false,message:"Please Enter some bookId in params"})
    let reviewId = req.params.reviewId
    if(!Object.keys(reviewId).length) return res.status(400).send({status:false,message:"Please Enter some bookId in params"})
    let book=await bookModel.findById(bookId)
        
    if(!book) return res.status(400).send({status:false, message:"Book is not present in DB"})
        
    if(book.isDeleted==true)return res.status(404).send({ status: false, message:"the book is already deleted"})
        
    let review=await reviewModel.findById(reviewId)
          
        
    if(!review) return res.status(400).send({status:false, message:"No review found for this book"})
        
    if(review.isDeleted==true)return res.status(404).send({ status: false, message:"This review is Deleted."})
        
    if(review.bookId != bookId) return res.status(400).send({status:false, message : "the review doesnt belong to this book or vice versa,change the given id"})
           
            //update the status of isDeleted to TRUE
    let updatedData = await reviewModel.findOneAndUpdate({ _id: reviewId }, {isDeleted:true }, { new: true });
    book.reviews--;
    await book.save();
        
    return res.status(200).send({ status: true, msg: "Successfuly Deleted" });  
    }
    catch(error){
    return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: error.message })
        
    }
        
    };
   
module.exports.reviews=reviews;
module.exports.updateReview=updateReview;
module.exports.deleteReview=deleteReview;