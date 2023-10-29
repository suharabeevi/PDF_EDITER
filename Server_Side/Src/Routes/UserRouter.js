var express = require("express");
var router = express.Router();
var upload= require('../utils/cloundinary')
const PdfModel =require('../models/pfdmodel')
const usercontroller =require('../Controllers/UserController')
const verifyToken = require('../Middleware/AuthMiddleware')

//routes
// route for user sign-up
router.post("/signup", usercontroller.UserSignup);
// define the route for user login
router.post("/login",usercontroller.userLogin)
// Route for uploading a PDF files
router.post('/upload_file',verifyToken,upload,usercontroller.uploadFiles)
// route for getting pdf
router.get("/get_documents",verifyToken,usercontroller.Get_files)


module.exports = router;