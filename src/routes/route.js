const express = require('express');
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const authenticationMW = require("../middleware/userAuthMiddleware")
const authorisationMW = require("../middleware/userAuthMiddleware")



router.post("/login", userController.userLogin)

router.post("/books" , authenticationMW.authentication ,authorisationMW.authorisation, bookController.createBook)






module.exports=router;
