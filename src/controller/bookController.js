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
 
const getBooks=async function(req,res){
    try{
    let filterData=req.query
    let{userId, category, subcategory,...rest}=filterData

    //check param is empty or not
    if(!Objec.keys(filterData).length) return res.status(400).send({status:false, message:"provide some data in param"})

    //check if any unwanted keys is present or not
    if(Object.keys(rest).length > 0) return res.status(400).send({status:false, message:"please provide valid attribute"})

    //check if any quer parm is present ?
    if (Object.keys(filterData).length !== 0) {

        //check if id inquery is valid or not
        if(!ObjectId.isValid(userId)){
            return res.status(400).send({status:false,msg:"invalid userId in query params"})
        }

        //add the keyisDeleted &isPublished in req.query
        req.query.isDeleted = false

        //find data as per req.query para filter ?
        let data = await bookModel.find(filterData)

        //check if data is found or not ?
        if (data.length != 0) return res.status(200).send({ status: true, data: data })
        return res.status(404).send({ status: false, msg: "No Document Found as per filter key " })
    }

    //get ta data as per query filter
    let data=await bookModel.find({isDeleted:false}).select({book_id:1,title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1})
    //check any data is present or not 
    if(data.length==0)return res.status(404).send({status:false,message:"no such data is found as per the query filter"})
    //return data 
    return res.status(200).send({statu:true,message:success,data:data})
    }
    catch(error){
        res.status(500).send({msg:"Serverside Errors. Please try again later", error: error.message})
      }
}

module.exports.createBook = createBook
module.exports.getBooks = getBooks