const mongoose = require("mongoose");
//user schema model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  phone: { type: String, required: false },
  place: { type: String, required: false, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  status: { type: Boolean, required: true, default: true },
});

const USER = mongoose.model("User", UserSchema);

module.exports = USER;
