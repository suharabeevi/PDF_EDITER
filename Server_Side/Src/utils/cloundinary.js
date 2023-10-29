const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// Multer configuration
const storageOptions = {
 
  cloudinary: cloudinary,
  
  params: {
    resource_type: 'auto',
    folder: 'PDF_folder',
    allowed_formats: [ 'pdf'],
    public_id: (req, file) => {
        // remove the file extension from the file name
        const fileName = file.originalname.split('.').slice(0, -1).join('.');
        return fileName+new Date();
    }
  }
};

const storage = new CloudinaryStorage(storageOptions);
const upload = multer({ storage: storage }).single('pdfFile');

module.exports = upload;


// const multer =require('multer')

// const storage = multer.memoryStorage()

// const upload = multer({
//     storage,
// })

// module.exports=upload
