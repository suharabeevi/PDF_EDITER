const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  pdfFiles: [
    {
      path: { type: String,trim: true },
      title: { type: String, trim: true },

    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',},
});

const documents = mongoose.model('documents', pdfSchema);

module.exports = documents;
