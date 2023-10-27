const mongoose = require("mongoose");
require('dotenv').config()
const configKeys=require('../Config')
const dbConnect = async () => {
  //database connection
  try {
    const dbOptions = {
      dbName: configKeys.DB_NAME, 
    };
    await mongoose.connect(configKeys.MONGODB_URL, dbOptions);
 
    console.log("Database connected...");
  } catch (error) {
    console.error("Database connection error", error);
    // Exiting the process or handle the error later
    process.exit(1);
  }
};

module.exports = dbConnect;