const express = require('express')
const { createuser, updateUserByParam, loginuser } = require('./userControllers')
const router = express.Router()


router.post("/register", createuser ) //create user
router.post("/login",loginuser)//login user
router.put("/user/:userId/profile",authenticate,authorize, updateUserByParam)//update user