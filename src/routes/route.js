const express = require('express');
const product = require('../products/index');
const router = express.Router();
const user =require('../users/index')

router.use('/',user)
router.use('/',product)



router.all("/**",  (req, res) => {
    return res.status(400).send({ status: false, msg: "Invalid api." })
});
module.exports = router;
