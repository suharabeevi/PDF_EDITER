const mongoose = require('mongoose');
const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  pdfFiles :{type:String},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:false}, // Reference to the user who owns this PDF
});

const documents = mongoose.model('documents', pdfSchema);
module.exports = documents;