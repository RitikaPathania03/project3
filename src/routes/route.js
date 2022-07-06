const express = require('express');
const router = express.Router();
const bookController= require("../controller/bookController")
const authentication = require("../middleware/userAuthMiddleware")
const authorisation = require("../middleware/userAuthMiddleware")



router.post("/books", authentication.authentication ,authorisation.authorisation, bookController.createBook) 




module.exports = router;
