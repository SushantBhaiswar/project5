const express = require('express');
const router = express.Router();
const product = require('../products/index');
const cart = require('../carts/index');
const user = require('../users/index');
const order = require('../order/index');

router.use('/', user)
router.use('/', product)
router.use('/', cart)
router.use('/', order)



router.all("/**", (req, res) => {
    return res.status(400).send({ status: false, msg: "Invalid api." })
});
module.exports = router;
