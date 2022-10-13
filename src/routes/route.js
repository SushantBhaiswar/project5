const express = require('express');
const router = express.Router();
const userRoute =require('../users/index')

router.use('/',userRoute)




router.all("/**",  (req, res) => {
    return res.status(400).send({ status: false, msg: "Invalid api." })
});
module.exports = router;
