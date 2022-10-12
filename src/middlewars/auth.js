const jwt = require("jsonwebtoken");

const userModel = require("../models/UserModel");
const { isValidObjectId } = require("./validations");


const authenticate = function (req, res, next) {
  try {
    let token = req.headers[`x-api-key`];
    if (!token) return res.status(400).send({ status: false, message: "Please set token in header" });
    let decodedToken = jwt.verify(token, "Token generation key", { ignoreExpiration: true }, function (error, done) {
      if (error) {
        return res.status(400).send({ status: false, message: "Token is Invalid" });
      }
      return done;
    })

    if (decodedToken.exp < Date.now() / 1000) return res.status(400).send({ status: false, message: "Token is Expired, Please relogin" });

    req.decodedToken = decodedToken.userId
    next()
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }

}

const authorize = async function (req, res, next) {
  try {
    let loggedUserId = req.decodedToken
    let paramUserId = req.params.userId
    

      if (!paramUserId) return res.status(400).send({ status: false, message: "Please enter userId in params" })
      if (!isValidObjectId(paramUserId)) return res.status(400).send({ status: false, message: "userId is not correct" });
      let checkUser = await userModel.findById(paramUserId)
      if (!checkUser) return res.status(404).send({ status: false, message: "User is not found" });
      if (checkUser._Id != loggedUserId) return res.status(400).send({ status: false, message: "Login user is not allowed to change the data of another user" });
    
    
    next()

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}


module.exports = { authenticate, authorize }