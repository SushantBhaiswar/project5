const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../middlewars/auth')
const { create, update } = require('./ordercontroller')

router.post("/users/:userId/orders", authenticate, authorize, create)
router.put("/users/:userId/orders", authenticate, authorize, update)


module.exports = router