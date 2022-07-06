const express = require('express');
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")



router.post("/login", userController.userLogin)






module.exports=router;