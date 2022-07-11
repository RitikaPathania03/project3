const express = require('express');
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const middleware = require("../middleware/userAuthMiddleware")
const reviewsController=require("../controller/reviewsController")



router.post("/register", userController.userRegistartion)

router.post("/login", userController.userLogin)

router.post("/books" , middleware.authentication  , middleware.authorisation, bookController.createBook)

router.get("/books",middleware.authentication, bookController.getBooks)

router.put("/books/:bookId", bookController.updateBooks)

router.get("/books/:bookId",middleware.authentication, bookController.getBooksById)

router.delete("/books/:bookId" , middleware.authentication  , middleware.authorisation, bookController.deleteBook)

router.post("/books/:bookId/review", reviewsController.reviews)

router.put("/books/:bookId/review/:reviewId",reviewsController.updateReview)

router.delete("/books/:bookId/review/:reviewId" , reviewsController.deleteReview)




module.exports=router;
