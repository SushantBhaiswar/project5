
const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    currencyId: {
        type: String,
        required: true,
        trim: true
    },
    currencyFormat: {
        type: String,
        required: true,
        trim: true
    },
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    productImage: {
        type: String,
        required: true,
        trim: true
    },
    style: {
        type: String,
        default: ''
    },
    availableSizes: [{
        type: String,
        required: true,
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
        trim: true
    }],
    installments: {
        type: Number,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })


module.exports = mongoose.model("Product", productSchema)