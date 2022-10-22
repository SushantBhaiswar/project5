const express = require("express")
const router = express.Router()
const { authenticate, authorize } = require("../middlewars/auth")
const { create, update, get, Delete } = require("./cartcontroller")

router.post("/users/:userId/cart" , authenticate,authorize , create)
router.put("/users/:userId/cart" , authenticate,authorize , update)
router.get("/users/:userId/cart" , authenticate,authorize , get)
router.delete("/users/:userId/cart" , authenticate,authorize , Delete)
module.exports = router