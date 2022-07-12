const express = require('express');
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const middleware = require("../middleware/userAuthMiddleware")
const reviewsController=require("../controller/reviewsController")



router.post("/register", userController.userRegistartion)//done

router.post("/login", userController.userLogin)//done

router.post("/books" , middleware.authentication  , middleware.authorisation, bookController.createBook) //to check

router.get("/books",middleware.authentication, bookController.getBooks)//done

router.put("/books/:bookId" , middleware.authentication, middleware.authorisation, bookController.updateBooks)//done but not by me

router.get("/books/:bookId",middleware.authentication, bookController.getBooksById)//done but not by me

router.delete("/books/:bookId" , middleware.authentication  , middleware.authorisation, bookController.deleteBook)//done but not by me

router.post("/books/:bookId/review", reviewsController.reviews)

router.put("/books/:bookId/review/:reviewId",reviewsController.updateReview)

router.delete("/books/:bookId/review/:reviewId" , reviewsController.deleteReview)




module.exports=router;
