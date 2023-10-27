const dotenv= require('dotenv')
dotenv.config();
const configKeys={
    PORT: process.env.PORT,
    DB_NAME:process.env.DB_NAME,
    MONGODB_URL:process.env.MONGODB_URL
}
module.exports = configKeys