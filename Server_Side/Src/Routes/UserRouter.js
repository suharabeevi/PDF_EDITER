var express = require("express");
var router = express.Router();
const usercontroller =require('../Controllers/UserController')

router.post("/signup", usercontroller.UserSignup);

module.exports = router;