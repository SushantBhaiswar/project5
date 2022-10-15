const express = require('express')
const { createuser, updateUserByParam, loginuser, getuser, forgetpassword, ResetPassword } = require('./userControllers')
const router = express.Router()
const { authorize, authenticate } = require('../middlewars/auth')

router.post("/register", createuser)
router.post("/login", loginuser)
router.get("/user/:userId/profile", authenticate, getuser)
router.put("/user/:userId/profile", authenticate, authorize, updateUserByParam)
router.post("/forgetpassword", authenticate, forgetpassword)
router.post("/ResetPassword", authenticate, ResetPassword)

module.exports = router