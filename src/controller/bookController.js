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


module.exports.createBook = createBook