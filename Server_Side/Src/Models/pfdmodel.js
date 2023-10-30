const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  pdfFiles: [
    {
      path:{ type: String,trim: true },
      name:{type:String, required:false,trim:true}
    },
  ],
  newPdffiles: [
    {
      path:{ type: String,trim: true, required:false},
      name:{type:String, required:false,trim:true}

    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',},
});

const documents = mongoose.model('documents', pdfSchema);

module.exports = documents;
