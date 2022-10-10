const express = require('express');
const { createuser } = require('../Controllers/userControllers');
const { uservalidatuion } = require('../middlewars/schemamiddleware');
const router = express.Router();


router.post("/register", createuser ) //create user


router.all("/**",  (req, res) => {
    return res.status(400).send({ status: false, msg: "Invalid api." })
});



module.exports = router;
