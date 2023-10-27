const  User  = require("../Models/UserModel");
const bcrypt = require("bcrypt");

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
};
