const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')

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
        if(!Object.keys(filterData).length) return res.status(400).send({status:false, message:"provide some data in param"})

        //check if any unwanted keys is present or not
       if(Object.keys(rest).length > 0) return res.status(400).send({status:false, message:"please provide valid attribute"})

 
        //check if authorId key is enterd in filter and if its is a valid objectid
        if (("userId" in filterData) && (!ObjectId.isValid(userId))) {
            return res.status(400).send({ status: false, msg: "Bad Request. UserId invalid" })
        }
        filterData.isDeleted = false
        
        let user = await userModel.findById(userId)
        if(!user) return res.status(400).send({ status: false, msg: "User not present in DB" })

        // finding the blog through the enterd condition and newly updated condition
        let savedBlogs = await bookModel.find(filterData).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}) //find return array of object
        // check if condition entered in the postman/filter doesnot match any document
        if (savedBlogs.length == 0) {
        return res.status(404).send({ status: false, msg: "Resource Not found. Please try another filter" })
        } 
        // if data found in DB
        return res.status(200).send({ status: true, data: savedBlogs })
        
        }
        catch (err) {
        return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })

        }

}
 


module.exports.createBook = createBook
module.exports.getBooks = getBooks









