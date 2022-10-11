const { APIGateway } = require('aws-sdk');
const express = require('express');
const { createuser,updateUserByParam } = require('../Controllers/userControllers');
const { uservalidatuion } = require('../middlewars/schemamiddleware');
const router = express.Router();

//.......................User API'S................................................................
router.post("/register", createuser ) //create user

router.put("/user/:userId/profile",updateUserByParam)



router.all("/**",  (req, res) => {
    return res.status(400).send({ status: false, msg: "Invalid api." })
});



module.exports = router;
