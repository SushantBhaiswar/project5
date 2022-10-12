const { APIGateway } = require('aws-sdk');
const express = require('express');
const { createuser,updateUserByParam, loginuser } = require('../Controllers/userControllers');
const { authenticate, authorize } = require('../middlewars/auth');
const router = express.Router();

router.post("/register", createuser ) //create user
router.put("/user/:userId/profile",authenticate,authorize, updateUserByParam)//update user
router.post("/login",loginuser)//login user



router.all("/**",  (req, res) => {
    return res.status(400).send({ status: false, msg: "Invalid api." })
});



module.exports = router;
