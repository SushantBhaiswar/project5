const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const UserModel = require("../Models/UserModel");
const ObjectId = mongoose.Types.ObjectId
require('dotenv')
module.exports = {
  authenticate: function (req, res, next) {
    try {
      let token = req.headers.authorization;
      if (!token) return res.status(400).send({ status: false, message: "Token is required" });
      let newtoken = token.split(" ")
      jwt.verify(newtoken[1], process.env.secret_key, function (error, decoded) {
        if (error) {
          return res.status(400).send({ status: false, message: error.message });
        }
        req.decodedtoken = decoded
        console.log(req.decodedtoken);
        next()
      })

    } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
    }

  },

  authorize: async function (req, res, next) {
    try {
      let UserId = req.params.userId
      if (!UserId) return res.status(400).send({ status: false, message: "userId in Required" })
      if (!ObjectId.isValid(UserId)) return res.status(400).send({ status: false, message: "Not a valid userid" });
      let checkUser = await UserModel.findById(UserId)
      if (!checkUser) return res.status(404).send({ status: false, message: "User not found" });

      if (checkUser._id.toString() !== req.decodedtoken.userId) return res.status(400).send({ status: false, message: "Unauthorize User" });

      next()

    } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
    }
  }

}