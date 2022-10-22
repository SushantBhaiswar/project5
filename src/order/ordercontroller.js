const cartmodel = require("../carts/cartmodel");
const ordermodel = require("./ordermodel");

module.exports = {
    create: async (req, res) => {
        let { userId  } = req.params
        let { cartid } = req.body
        let findcart = await cartmodel.findOne({ _id: cartid, userId: userId })
        // if (findcart.items.length == 0)
        //     return res.status(400).send({ status: false, msg: " Cart is empty " })

        if (!findcart) {
            return res.status(404).send({ status: true, msg: " Cart not found " })
        }
        console.log(findcart);
        // let z = await cartmodel.aggregate(
        //     [{
        //         $addFields: {
        //             total: { $sum: "$items.quantity" }
        //         }
        //     }]
        // )
        // res.send(z)

        // console.log(z);
        // return res.send(z)
        // const agg = cartmodel.aggregate(
        //     //     [
        //     //         {
        //     //             "$group": {
        //     //                 "_id": "$cartid",
        //     //                 "totalValue": {
        //     //                     "$sum": { "$sum": "$items.quantity" }
        //     //                 }
        //     //             }
        //     //         }
        //     //     ]
        //     // )
        //     [{ $match: { _id: "$cartid" } },
        //     { $group: { items: { quantity: { $sum: "$quantity" } } } }]);
        // console.log(agg);
        let count = 0
        for (let i = 0; i < findcart.items.length; i++) {
            count += findcart.items[i].quantity
        }
        findcart.totalQuantity = count
        let createorder = await ordermodel.create(findcart)
        findcart.items = []
        findcart.totalItems = 0
        findcart.totalPrice = 0
        await cartmodel.findOneAndUpdate({ _id: cartid }, findcart, { new: true })
        res.status(201).send({ status: true, msg: "order created successfully", details: createorder })
    },
    update: async (req, res) => {
        let { orderid } = req.body
        let findorder = await ordermodel.findById(orderid)
        if (!findorder)
            return res.status(404).send({ status: false, msg: "order details not found" })
        if (findorder.userId.toString() !== req.params.userId)
            return res.status(400).send({ status: false, msg: "order details not found" })
        if (findorder.status == "cancelled")
            return res.status(200).send({ status: true, msg: "order is already cancelled " })
        if (findorder.cancellable == true) {
            await ordermodel.findOneAndUpdate({ _id: orderid }, { status: "cancelled" })
            return res.status(200).send({ status: true, msg: "order cancelled" })
        }
        return res.status(200).send({ status: true, msg: "order is not cancellable " })
    }
}