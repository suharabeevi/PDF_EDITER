var express = require("express");
var router = express.Router();
var upload= require('../Config/cloundinary')
const PdfModel =require('../Models/Documents')
const usercontroller =require('../Controllers/UserController')
const verifyToken = require('../Middleware/AuthMiddleware')

//routes
router.post("/signup", usercontroller.UserSignup);
router.post("/login",usercontroller.userLogin)
router.post('/upload_file',verifyToken,upload,usercontroller.uploadFiles)


module.exports = router;