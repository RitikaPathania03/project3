const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")

const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')
const reviewModel = require("../model/reviewModel")
const { findOne } = require("../model/reviewModel")

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

        if (!reqBody.userId) return res.status(400).send({ status: false, message: "Please Enter UserId" })

        if((reqBody.userId.trim().length == 0)){
            return res.status(400).send({ status: false, msg: "Bad Request. User Id cannot be empty"})
        }

        if(!ObjectId.isValid(userId)){
            return res.status(400).send({ status: false, msg: "UserId invalid" })
        }

        if(!isValid(reqBody.ISBN)) return res.status(400).send({status: false, message: "Please Enter ISBN"})


        if((reqBody.ISBN.trim().length) < 13){
         return res.status(400).send({ status: false, msg: "Bad Request. Please enter Valid ISBN"})
        }

        let checkIfISBNIsPresent = await bookModel.findOne({ISBN:reqBody.ISBN})
        
        if(checkIfISBNIsPresent)return res.status(400).send({status: false, message:"This ISBN already exist"})

        if (!reqBody.reviews) return res.status(400).send({ status: false, message: "Please Enter Reviews" })

        if (!reqBody.subCategory) return res.status(400).send({ status: false, message: "Please Enter Subcategory" })

        if(("subCategory" in reqBody) && (reqBody.subCategory.length == 0)){
            return res.status(400).send({ status: false, msg: "Bad Request. Subcategory cannot be empty"})
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

                                      

let getBooks = async function(req,res){

    try {
        // stored all the data from query params in a variable
        let filterData=req.query
        let{userId, category, subcategory,...rest}=filterData

        //check param is empty or not
        //if(!Object.keys(filterData).length) return res.status(400).send({status:false, message:"provide some data in param"})

        //check if any unwanted keys is present or not
       if(Object.keys(rest).length > 0) return res.status(400).send({status:false, message:"please provide valid attribute"})

 
        if (("userId" in filterData) && (!ObjectId.isValid(userId))) {
        return res.status(400).send({ status: false, msg: "Bad Request. UserId invalid" })
        }

        let user = await userModel.findById(userId)
        if(!user) return res.status(400).send({ status: false, msg: "User not present in DB" })

        let savedBlogs = await bookModel.find({filterData,isDeleted:false}).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}) //find return array of object

        if (savedBlogs.length == 0) {
        return res.status(404).send({ status: false, msg: "Resource Not found. Please try another filter" })
        } 
        return res.status(200).send({ status: true,status:'Books list', data: savedBlogs })
        
        }
        catch (err) {
        return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })

        }

}
const updateBooks = async function (req, res) {
    try {
            // Stores the blog id data recieved in params in to a new variable
        let enteredBookId = req.params.bookId
        let data = req.body
        let {title,excerpt,releasedAt,ISBN,isDeleted,...rest} = data
            

            //check if body is empty or not
        if(!Object.keys(data).length) return res.status(400).send({status:false, message:"provide some data in param"})

            //check if any unwanted keys is present or not
        if(Object.keys(rest).length > 0) return res.status(400).send({status:false, message:"please provide valid attribute"})

            
        if(title && (!isValid(data.title)) )return res.status(400).send({status: false, message: "Please Enter valid title"})
    
        if(excerpt &&(!isValid(data.excerpt)) )return res.status(400).send({status: false, message: "Please Enter valid excerpt"})

        if(ISBN){
                if(!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(data.ISBN))res.status(400).send({status:false,msg:"enter valid ISBN"})  }

        if(releasedAt && (!isValid(data.releasedAt)))return res.status(400).send({status: false, message: "Please Enter valid releasedAt"})

        let checkBookId = await bookModel.findById({enteredBookId})
        if(!checkBookId) return res.status(404).send({status:false, message :"This book does not exist"})
        if(Object.keys(checkBookId)==null)return res.status(404).send({status:false,msg:"user book data is empty in db"})
            
        if(checkBookId.isDeleted) 
        return res.status(404).send({status:false, message : "This Book is already Deleted"})

        let checkISBN = await bookModel.findOne({ISBN : ISBN})
        if(checkISBN) return res.status(400).send({status:false, message: "This ISBN already exist"})
        console.log(checkISBN)
            

        let updateData = await bookModel.findByIdAndUpdate(enteredBookId, {  
        title,excerpt,releasedAt,ISBN
        }, { new: true })
        return res.status(200).send({ status: true, data: updateData })
        
        }
        catch (err) {
        return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })
        }
        }

// const updateBooks = async function (req, res) {
//     try {
//         // Stores the blog id data recieved in params in to a new variable
//         let bookId = req.params.bookId

//         let updateData = await bookModel.findByIdAndUpdate(bookId, {
//         title: req.body.title, 
//         excerpt: req.body.excerpt,
//         releasedAt : req.body.releasedAt,
//         ISBN: req.body.ISBN
//         }, { new: true })
//         return res.status(200).send({ status: true,msg:"Success", data: updateData })
        
//         }
//         catch (err) {
//         return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })
//         }
//         }



    let getBooksById=async function(req,res){
    try{
    let bookId=req.params.bookId
    bookId.isDeleted=false
            //check bookId is valid or not
    if(!ObjectId.isValid(bookId)) return  res.status(400).send({ status: false, message:"invalid bookid"})
            //check bookId is present or not in DB
    let checkBook=await bookModel.findById(bookId)
    if(!checkBook)return  res.status(404).send({ status: false, message:"book is not present in DB"})
            //check if the book isDeleted or not
    if(checkBook.isDeleted==true) return res.status(404).send({ status: false, message:"the book is already deleted"})
            //Check reviews
    let reviewsData=await reviewModel.find({bookId:bookId,isDeleted:false}).select({_id:1,bookId:1,reviewedBy:1,reviewedAt:1,review:1,rating:1});
            
    let { _id, title, excerpt,userId, category, subCategory, isDeleted, reviews,releasedAt,createdAt, updatedAt }=checkBook
        
            //fetch tha data
    let data={ _id, title,excerpt,userId, category, subCategory,isDeleted, reviews,releasedAt,createdAt, updatedAt, reviewsData}
    return res.status(200).send({status:true,message:"Books list", data:data})
    }
    catch(error){
    return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: error.message })
        
    }
    }

const deleteBook=async function(req,res){
    try{
    let bookId=req.params.bookId
    let book=await bookModel.findById(bookId)

    //if(!ObjectId.isValid(book)) return res.status(404).send({ status: false, message:"invalid bookId"})
    //check if isDeleated Status is True
    if(book.isDeleted==true)return res.status(404).send({ status: false, message:"the book is already deleted"})
    //update the status of isDeleted to TRUE
    let updatedData = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true }, { new: true });
    return res.status(200).send({ status: true, msg: "successfuly Deleted" });
    }
    catch(error){
    return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: error.message })

    }

}


module.exports.deleteBook=deleteBook
module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.updateBooks = updateBooks
module.exports.getBooksById = getBooksById





