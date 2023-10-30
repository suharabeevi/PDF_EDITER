const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const documents = require("../models/pfdmodel");
const { token } = require("morgan");
const mongoose = require("mongoose");
const objectId = require("mongodb").ObjectId;
const { ObjectId } = require("bson");
const { query } = require("express");
const PDFDocument = require('pdf-lib')
const axios = require('axios');
const fs = require('fs');

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

      res.status(200).json({ message: "User login successfull", user, token });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  // upload pdf
  uploadFiles: async (req, res) => {
    console.log(req.body, req.file);
    let user = req.user._id;
    const fileName = req.file ? req.file.path : null;
    try {
      // Find the document by the provided parameter (e.g., ID)
      const existingDocument = await documents.findOne({ user: user });
      if (existingDocument) {
        // If the document already exists, push the file path into its pdfFiles array
        if (fileName) {
          existingDocument.pdfFiles.push({ path: fileName, name:req.file.originalname});
          await existingDocument.save();
        }
        return res.send({
          status: true,
          message: "Document updated successfully",
        });
      } else {
        // If the document doesn't exist, create a new one with the provided ID
        let obj = { fileName };
        const newDocument = await documents.create({
          pdfFiles: {  path: fileName ,name:req.file.originalname },
          user: user,
        });

        await newDocument.save();

        return res.send({
          status: true,
          message: "Document created and uploaded successfully",
        });
      }
    } catch (error) {
      res.json({ status: false, error: error.message });
    }
  },
  //get PDF files
  Get_files: async (req, res) => {
    const user = req.user._id;

    try {
      const result = await documents
        .aggregate([
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
              name: "$pdfFiles.name",
            },
          },
        ])
        .exec(); // Remove the callback

      res.send({ status: "get all files", data: result });
    } catch (error) {
      res.json({ status: false, error: error.message });
    }
  },
  // function for getting specific PDF file
  getpdf: async (req, res) => {
    const userId = req.user._id;
    let pdfId = req.params.pdfId;
    try {
      const user = await documents.findOne({ user: userId });

      if (!user) {
        return res.json({ status: false, error: "User not found" });
      }
      // Find the PDF by its ID within the user's PDFs array
      pdfId = pdfId.toString();
      const pdf = user.pdfFiles.find((pdf) => pdf._id.toString() === pdfId);

      if (!pdf) {
        return res.json({ status: false, error: "PDF not found" });
      }
      return res.json({ status: true, pdf });
    } catch (error) {
      return res.json({ status: false, error: error.message });
    }
  },

 // Assuming you have the 'pdf-lib' library installed
 // Required to make HTTP requests

// Define an asynchronous function to extract selected pages from a PDF
 getPages: async (req, res) => {
  // Extract user ID from the request
  const userId = req.user._id;

  // Extract PDF ID and selected pages from the request
  let pdfId = req.params.pdfId;
  let selectedPages = req.query.pages;

  try {
    // Find the user in the database by their ID
    const user = await documents.findOne({ user: userId });

    // If the user is not found, return an error response
    if (!user) {
      return res.json({ status: false, error: "User not found" });
    }

    // Find the PDF within the user's PDFs array by its ID
    pdfId = pdfId.toString();
    const pdf = user.pdfFiles.find((pdf) => pdf._id.toString() === pdfId);
console.log(pdf);
    // If the PDF is not found, return an error response
    if (!pdf) {
      return res.json({ status: false, error: "PDF not found" });
    }

    // Get the Cloudinary URL for the PDF
    const pdfUrl = pdf.path;

    // Download the PDF from Cloudinary using Axios
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const pdfData = response.data;

    // Load the PDF data into a PDFDocument
    const pdfDoc = await PDFDocument.PDFDocument.load(pdfData);

    // Parse the selected page numbers
    const selectedPageNumbers = selectedPages
      .split(",")
      .map((page) => parseInt(page));

    // Check if selected page numbers are valid
    if (selectedPageNumbers.some((page) => page < 1 || page > pdfDoc.getPageCount())) {
      return res.json({ status: false, error: "Invalid page number(s)" });
    }

    // Create a new PDF document to hold the selected pages
    const newPdfDoc = await PDFDocument.PDFDocument.create();

    // Copy the selected pages to the new PDF
    for (const pageNumber of selectedPageNumbers) {
      const copiedPage = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage[0]);
    }

    // Save the new PDF document and associate it with the user
    const newPdfBytes = await newPdfDoc.save();
    user.newPdffiles.push({ path: newPdfBytes ,name:pdf.originalname });
    await user.save();

    // Set response headers and send the new PDF to the user
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${pdf.name}"`
    );
    res.json({
      status: true,
    });
  } catch (error) {
    // Handle any errors and return an error response
    console.error(error);
    return res.json({ status: false, error: "An error occurred" });
  }
}


  

}
