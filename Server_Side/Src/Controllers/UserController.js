const  User  = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const pdfSchema = require('../Models/DocumentsModel')

module.exports = {
  //user signup
  UserSignup: async (req, res) => {
    try {
      console.log(req.body);
      const user = await User.findOne({ email: req.body?.email });
      if (user)
        return res
          .status(409)
          .send({ message: "User with given email already Exist!" });

    //   const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      await new User({ ...req.body, password: hashPassword }).save();
      return res.status(201).send({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  // user login
  userLogin: async (req, res) => {
    try {
      
      var user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(401).send({ message: "Invalid Email or Password" });

      if (user.Block) return res.status(409).send({ message: "User Blocked!" });

      var validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(401).send({ message: "Invalid Emailor Password" });

      // var token = user.generateAuthToken();

      res.status(200).json({  message :"User login successfull",user });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },
  // upload pdf
  uploadfiles:async(req,res)=>{
    const title =req.body.title
    console.log(req.file);
    const fileName = req.file?.path;
    try{
       await pdfSchema.create({title:title,pdfFiles:fileName})
       return res.send({status:true ,message: "upload document Successfully"})
    }
    catch(error){
     res.json({status:error})
    }
  }
  
};
