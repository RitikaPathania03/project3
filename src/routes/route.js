const express = require('express');
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const middleware = require("../middleware/userAuthMiddleware")
//const authorisationMW = require("../middleware/userAuthMiddleware")


router.post("/register", userController.userRegistartion)

router.post("/login", userController.userLogin)

router.post("/books" , middleware.authentication , middleware.authorisation, bookController.createBook)

router.get("/books",middleware.authentication, bookController.getBooks)






module.exports=router;
