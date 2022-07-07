const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')
const reviewModel = require("../model/reviewModel")

const isValid = function (value) {
    if ( value === "undefined" || value === null) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length == 0
}

const createBook = async function(req,res){ 
    try{
        let reqBody = req.body
        let {userId,title,excerpt,ISBN,category,subCategory,reviews} = req.body

        if(isValidRequestBody(reqBody)) return res.status(400).send({status: false, message: "Please Provide Book Data"})
    
        if(!isValid(reqBody.title)) return res.status(400).send({status: false, message: "Please Enter title"})
    
        if(!isValid(reqBody.excerpt)) return res.status(400).send({status: false, message: "Please Enter excerpt"})

        if(!isValid(reqBody.ISBN)) return res.status(400).send({status: false, message: "Please Enter ISBN"})

        if((reqBody.ISBN.trim().length) < 13){
         return res.status(400).send({ status: false, msg: "Bad Request. Please enter Valid ISBN"})
        }

        if(!isValid(reqBody.userId)) return res.status(400).send({status: false, message: "Please Enter UserId"})

        if(!ObjectId.isValid(userId)){
            return res.status(400).send({ status: false, msg: "UserId invalid" })
        } 

        let checkIfUserIsPresent = await userModel.findOne({_id:reqBody.userId})
        
        if(!checkIfUserIsPresent)return res.status(404).send({status: false, message:"This user doesnt exist in the Database"})

        if(!isValid(reqBody.category)) return res.status(400).send({status: false, message: "Please Enter category"})

        if(!isValid(reqBody.subCategory)) return res.status(400).send({status: false, message: "Please Enter subcategory"})

        let releasedAt = moment().format('YYYY-MM-DD ')
        releasedAt.reqBody = req.body
        let savedData = await bookModel.create(reqBody)
        res.status(201).send({status:true, message:"Success", data : savedData})
    }
    catch(err){
        res.status(500).send({msg:"Serverside Errors. Please try again later", error: err.message})
    }
}

// const getBook=async function(req,res){
//     try{
//     let bookId=req.params;
   
//     let bookData=await bookModel.findOne({_id:bookId,isDeleted:false})
//     let checkReviews=(!bookData.reviews==0)
//     let emptyArr=[]
//     if(checkReviews){ res.send({status:true,msg:"books list",data:bookData{reviewData:emptyArr}})
                                                                 

//     const allReviews=await reviewModel.find({bookId: bookData._id, isDeleted:false}).select({
//         bookId:1,
//         reviewedBy:1,
//         reviewedAt:1,
//         rating:1,
//         review:1
//     })
     
    

    
    
    
// }}catch(err){res.status(500).send({msg:"error",error:err.message});}}


//=====================update books===========================================================================================================
const updateBook=async function(req,res){
    try{
    let bookId=req.params;
    if(!bookId){res.status(400).send({status:false,msg:"enter userId"})}
    let data=req.body;
    if(Object.keys(data).length == 0){res.status(400).send({ msg: 'request body cant be empty' })}
    let newKeys=data.title||data.excerpt||data.releasedAt||data.ISBN;
    if(!newKeys){res.status(400).send({status:false,msg:"you can only update title,excerpt,releasedAt or ISBN"})}
 
    let checkBook= await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!checkBook){res.status(401).send({status:false,msg:"No such book exists"})}
    if (data.title){if(typeof data.title !== 'string') { res.status(400).send({ msg: 'title should be string type' }) }; 
    checkBook.title = data.title};
    if(data.excerpt){if(typeof data.excerpt !== 'string') { res.status(400).send({ msg: 'excerpt should be string type' }) }; 
    checkBook.excerpt=data.excerpt};
    if(data.releasedAt)checkBook.releasedAt=data.releasedAt;
    if(data.ISBN)checkBook.ISBN=data.ISBN;

  
    let updatedData=await bookModel.findOneAndUpdate({_id:bookId},checkBook,{new:true});
    return res.status(200).send({status:True,msg:"Success",data:updatedData})
    }catch(err){res.status(500).send({msg:"error",error:err.message});
}}

    
    
    
    
    
 

module.exports.createBook = createBook;
module.exports.updateBook=updateBook;