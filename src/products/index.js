const { create, getbyfilter, getbyid, update, Delete } = require('./productcontroller')

let express = require('express')
 router = express.Router()

router.post("/products", create)//create product
router.get("/products", getbyfilter)//get products by filter
router.get("/products/:productId", getbyid)//get products by id
router.put("/products/:productId", update)//update products by id
router.delete("/products/:productId", Delete)//delete products by id



module.exports = router