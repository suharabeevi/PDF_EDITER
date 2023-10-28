const mongoose = require("mongoose");
const jwt=require('jsonwebtoken')
//user schema model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  phone: { type: String, required: false },
  place: { type: String, required: false, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  status: { type: Boolean, required: true, default: true },
});


UserSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const USER = mongoose.model("User", UserSchema);

module.exports = USER;
