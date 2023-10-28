var express = require("express");
var router = express.Router();
var upload= require('../Config/cloundinary')
const PdfModel =require('../Models/DocumentsModel')
const usercontroller =require('../Controllers/UserController')

router.post("/signup", usercontroller.UserSignup);
router.post("/login",usercontroller.userLogin)
router.post('/upload_file', upload,usercontroller.uploadfiles)


module.exports = router;