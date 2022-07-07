const express = require('express');
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const authenticationMW = require("../middleware/userAuthMiddleware")
const authorisationMW = require("../middleware/userAuthMiddleware")


router.post("/register", userController.userRegistartion)

router.post("/login", userController.userLogin)

router.post("/books" , authenticationMW.authentication , authorisationMW.authorisation, bookController.createBook)

router.get("/books/:bookId", authenticationMW.authorisation, bookController.getBook)

router.put("/books/:bookId", authenticationMW.authentication,authorisationMW, bookController.updateBook)


module.exports=router;
