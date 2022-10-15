const mongoose = require("mongoose");
const { uploadFile } = require("../aws");
const { findOne } = require("./productmodel");
const productModel = require("./productmodel");
const { productvalidation, getproductvalid, updateproductvalid } = require("./productschemavalid");
const objectId = mongoose.Types.ObjectId

module.exports = {

    create: async (req, res) => {
        try {
            let file = req.files
            let data = req.body
            let arr = data.availableSizes.split(",")
            let valid = ["S", "XS", "M", "X", "L", "XXL", "XL"]
            for (let i = 0; i < arr.length; i++) {
                let ind = valid.indexOf(arr[i])
                if (ind == -1) {
                    return res.status(400).send({
                        status: false, message: "availableSizes must be one of [S, XS, M, X, L, XXL, XL]"
                    })
                }
            }
            if (file.length == 0) {
                return res.status(400).send({ status: false, message: "productimage is required" })
            }

            let createlink = await uploadFile(file[0])
            data.productImage = createlink

            let { error } = productvalidation.validate(data)//validate req body
            if (error)
                return res.status(400).send({ status: false, message: error.message })
            data.availableSizes = arr
            let findtitle = await productModel.findOne({ title: data.title })
            if (findtitle) return res.status(200).send({ status: false, message: "Title is already exist" })
            let createdoc = await productModel.create(data)
            return res.status(201).send({ status: true, message: 'Success', data: createdoc })

        } catch (error) {
            return res.status(500).send({ status: false, Msg: error.message })
        }
    },
    getbyfilter: async (req, res) => {
        try {
            let { Size, Productname, priceGreaterThan, priceLessThan, priceSort } = req.query

            const { error } = getproductvalid.validate(req.query)
            if (error)
                return res.status(400).send({ status: false, message: error.message })

            let object = { isDeleted: false }
            if (Size) object.availableSizes = Size
            if (Productname) object.title = Productname
            if (priceGreaterThan && priceLessThan) object.price = { $gte: priceGreaterThan, $lte: priceLessThan }
            else {
                if (priceGreaterThan) object.price = priceGreaterThan
                if (priceLessThan) object.price = priceGreaterThan
            }
            if (!priceSort) priceSort = -1
            let findproduct = await productModel.find(object).sort({ price: priceSort })
            if (findproduct.length == 0) return res.status(404).send({ status: false, Msg: "No data Found" })
            return res.status(200).send({ status: true, message: "Data Found", data: findproduct })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },
    getbyid: async (req, res) => {
        try {
            let { productId } = req.params
            if (!productId) return res.status(400).send({ status: false, msg: "productId is required" })
            if (!objectId.isValid(productId)) return res.status(400).send({ status: false, msg: "productId is not valid" })
            let findproduct = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!findproduct) return res.status(404).send({ status: false, msg: "Data Not found" })
            return res.status(400).send({ status: true, msg: "Data found", Data: findproduct })
        } catch (error) {
            return res.status(500).send({ status: false, Msg: error.message })

        }
    },
    update: async (req, res) => {
        try {
            let { productId } = req.params
            if (!productId) return res.status(400).send({ status: false, msg: "productId is required" })
            if (!objectId.isValid(productId)) return res.status(400).send({ status: false, msg: "productId is not valid" })

            let findproduct = await productModel.findOne({ isDeleted: false, _id: productId }).lean()
            if (!findproduct) return res.status(404).send({ status: false, msg: "Data Not found" })
            const { error } = updateproductvalid.validate(req.body)
            if (error)
                return res.status(400).send({ status: false, msg: error.message })

            let { title, description, price, isFreeShipping, productImage, style, availableSizes, installments } = req.body
            if (title) {
                let finduniuqe = await productModel.findOne({ title: title })
                if (finduniuqe) return res.status(200).send({ status: false, msg: "Title should be unique" })
            }
            findproduct.title = title
            if (description) findproduct.description = description
            if (price) findproduct.price = price
            if (isFreeShipping) findproduct.isFreeShipping = isFreeShipping
            if (productImage) return res.status(400).send({ status: true, msg: "Wrong input file" })
            if (req.files.length > 0) {
                let file = req.files
                let link = await uploadFile(file[0])
                findproduct.productImage = link
            }

            if (style) findproduct.style = style
            if (availableSizes) {

                let arr = availableSizes.split(",")
                for (let i = 0; i < arr.length; i++) {
                    let ind = findproduct.availableSizes.indexOf(arr[i])
                    if (ind == -1) {
                        findproduct.availableSizes.push(arr[i])
                    }
                }
            }

            if (installments) findproduct.installments = installments
            let updatedoc = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, findproduct, { new: true })
            return res.status(200).send({ status: true, msg: "Data Updated", Data: updatedoc })

        } catch (error) {
            return res.status(500).send({ status: false, Msg: error.message })
        }
    },

    Delete: async (req, res) => {
        try {
            let { productId } = req.params
            if (!productId) return res.status(400).send({ status: false, msg: "productId is required" })
            if (!objectId.isValid(productId)) return res.status(400).send({ status: false, msg: "productId is not valid" })

            let findproduct = await productModel.findOne({ isDeleted: true, _id: productId })
            if (!findproduct) return res.status(404).send({ status: false, msg: "Data Not found" })

            let updatedata = await productModel.findOneAndUpdate({ _id: productId }, { isDeleted: true }, { new: true })
            console.log(updatedata)
            if (updatedata) return res.status(400).send({ status: false, Msg: "Data Deleted Successfully" })

        } catch (error) {
            return res.status(500).send({ status: false, Msg: error.message })
        }
    }
}