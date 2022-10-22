const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: "User",
        trim: true
    },
    items: [{
        productId: {
            type: ObjectId,
            required: true,
            ref: "Product",
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            default : 1
        },
        _id : false
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    totalItems: {
        type: Number,
        required: true,
    }
}, { timestamps: true })


module.exports = mongoose.model("Cart", cartSchema)