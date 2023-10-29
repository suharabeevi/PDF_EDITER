const  User  = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const documents = require('../models/pfdmodel');
const { token } = require("morgan");
const mongoose =require('mongoose')
const objectId = require("mongodb").ObjectId;
const { ObjectId } = require("bson");



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

         // Store user information in the session
         var token = user.generateAuthToken();
     
      res.status(200).json({  message :"User login successfull",user,token });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  // upload pdf
   uploadFiles: async (req, res) => {
    console.log(req.body,req.file);
    let user = req.user._id;
    const title = req.body.title;
    const fileName = req.file ? req.file.path : null;
  
    try {
      // Find the document by the provided parameter (e.g., ID)
      const existingDocument = await documents.findOne({ user: user });  
      if (existingDocument) {
        // If the document already exists, push the file path into its pdfFiles array
        if (fileName) {
          existingDocument.pdfFiles.push({ path: fileName,title:title });
          await existingDocument.save();
        }
        return res.send({ status: true, message: "Document updated successfully" });
      } else {
        // If the document doesn't exist, create a new one with the provided ID
        let obj = {fileName, title}
        const newDocument = await documents.create({pdfFiles:{title: title, path: fileName},user:user});
        
          await newDocument.save();
        
        return res.send({ status: true, message: "Document created and uploaded successfully" });
      }
    } catch (error) {
      res.json({ status: false, error: error.message });
    }
  },
//get PDF files
Get_files : async (req, res) => {
  const user = req.user._id;

  try {
    const result= await documents.aggregate([
      {
         $match: {
              user: new objectId(user),
            },
      },
      {
        $unwind: "$pdfFiles",
      },
      {
        $project: {
          _id: 0,
          path: "$pdfFiles.path",
          title: "$pdfFiles.title",
        },
      },
    ]).exec(); // Remove the callback

    res.send({ status: "get all files", data: result });
  } catch (error) {
    res.json({ status: false, error: error.message });
  }

}
  
};
