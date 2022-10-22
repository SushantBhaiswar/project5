const cartModel = require("./cartmodel")
const productModel = require("../products/productmodel")
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


module.exports = {
    create: async (req, res) => {
        let { userId } = req.params
        let { cartId, productId, quantity } = req.body
        if (!ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "Not a valid productId" });
        // if (quantity && quantity !== "number")
        //     return res.status(400).send({ status: false, msg: "Quantity can be a Number Only!" })

        if (!quantity) quantity = 1
        let findproduct = await productModel.findOne({ isDeleted: false, _id: productId })
        console.log(findproduct);
        if (!findproduct) return res.status(404).send({ status: true, msg: "Product not found " })

        let findcart = await cartModel.findOne({ isDeleted: false, userId: userId })

        if (findcart) {
            if (!cartId) {
                return res.status(200).send({ status: true, msg: " Cart already Exist enter cart id" })
            }
            for (let i = 0; i < findcart.items.length; i++) {
                if (findcart.items[i].productId == productId) {
                    var found = findcart.items[i].productId
                    findcart.items[i].quantity += quantity
                    findcart.totalPrice += findproduct.price * quantity
                }
            }
            if (!found) {
                findcart.items.push({ productId: productId, quantity: quantity })
                findcart.totalPrice += findproduct.price
                findcart.totalItems += quantity
            }
            let updatecart = await cartModel.findOneAndUpdate({ _id: cartId }, findcart, { new: true }).populate({ path: "items.productId", model: "Product", select: { title: 1, productImage: 1, price: 1 } })

            return res.status(200).send({ status: true, data: updatecart })
        }
        else {
            let obj = { userId: userId, items: [{ productId: productId, title: findproduct.title, quantity: quantity, productImage: findproduct.productImage }] }
            obj.totalPrice = findproduct.price * quantity
            obj.totalItems = quantity
            let createcart = await cartModel.create(obj)
            let findcart = await cartModel.findById(createcart._id).populate({ path: "items.productId", model: "Product", select: { title: 1, productImage: 1, price: 1 } })
            // obj._id = createcart._id
            // obj.createdAt = createcart.createdAt
            // obj.updatedAt = createcart.updatedAt
            res.status(201).send({ status: true, msg: "cart created successfully", findcart })
        }

    },
    update: async (req, res) => {
        let { cartid, productId, removeproduct } = req.body
        if (!ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "Not a valid productId" });
        if (!ObjectId.isValid(cartid)) return res.status(400).send({ status: false, message: "Not a valid cartid" });
        let findproduct = await productModel.findOne({ isDeleted: false, _id: productId })
        if (!findproduct) {
            return res.status(404).send({ status: true, msg: "product not found" })
        }

        if (!cartid && !productId && !removeproduct)
            return res.status(400).send({ status: true, msg: "Enter the required fields" })
        let findcart = await cartModel.findOne({ isDeleted: false, _id: cartid, items: { $elemMatch: { productId: productId } } })

        if (!findcart) {
            return res.status(404).send({ status: true, msg: " Cart id and product id does not match product might be delected" })
        }

        // if (removeproduct !== 0 || removeproduct !== 1)
        //     return res.status(200).send({ status: true, msg: "removeproduct either be 0 or 1" })
        if (removeproduct == 1) {
            var arr = []
            for (let i = 0; i < findcart.items.length; i++) {
                if (findcart.items[i].productId.toString() !== productId) {
                    arr.push(findcart.items[i])
                }
                else
                    var found = findcart.items[i]
            }
            if (found.quantity == 1) {
                findcart.items = arr
                findcart.totalItems = findcart.totalItems - 1
                findcart.totalPrice = findcart.totalPrice - findproduct.price
            } else {
                found.quantity = found.quantity - 1
                findcart.totalPrice = findcart.totalPrice - findproduct.price
            }
        }
        if (removeproduct == 0) {
            var array = []
            for (let i = 0; i < findcart.items.length; i++) {
                if (findcart.items[i].productId.toString() !== productId) {
                    array.push(findcart.items[i])
                }
                else
                    var found = findcart.items[i]
            }
            findcart.totalItems = findcart.totalItems - 1
            console.log(findcart);
            findcart.totalPrice = findcart.totalPrice - (findproduct.price * found.quantity)
            findcart.items = array
        }
        let updatecart = await cartModel.findOneAndUpdate({ _id: cartid }, findcart, { new: true }).populate({ path: "items.productId", model: "Product", select: { title: 1, productImage: 1, price: 1 } })
        return res.status(200).send({ status: true, msg: "Data updated successfully", data: updatecart })


    },
    get: async (req, res) => {
        try {
            let { userId } = req.params
            let { cartid } = req.body
            if (!ObjectId.isValid(cartid)) return res.status(400).send({ status: false, message: "Not a valid cartid" });

            let findcart = await cartModel.findOne({ _id: cartid, userId: userId }).populate({ path: "items.productId", model: "Product", select: { title: 1, productImage: 1, price: 1 } })
            if (!findcart) {
                return res.status(404).send({ status: true, msg: "Cart not found cart id and userid does not match" })
            }
            return res.status(200).send({ status: true, data: findcart })
        } catch (error) {
            return res.status(500).send({ status: true, message: error.message })

        }
    },
    Delete: async (req, res) => {
        let { userId } = req.params
        let { cartid } = req.body
        if (!ObjectId.isValid(cartid)) return res.status(400).send({ status: false, message: "Not a valid cartid" });

        let findcart = await cartModel.findOne({ _id: cartid, userId: userId })
        if (!findcart) {
            return res.status(404).send({ status: true, msg: "Cart not found cart id and userid does not match" })
        }
        findcart.items = []
        findcart.totalItems = 0
        findcart.totalPrice = 0

        let updatecart = await cartModel.findOneAndUpdate({ _id: cartid }, findcart, { new: true })
        return res.status(204).send({ status: true, data: updatecart })

    }
}
