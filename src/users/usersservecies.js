const UserModel = require("./UserModel");
const bcrypt = require("bcrypt");
const { usermodule, userupdate } = require("./schemavalidation");
const createError = require('http-errors');
const { uploadFile } = require("../aws");
const md5 = require('md5')
const jwt = require('jsonwebtoken')
require('dotenv')


module.exports = {

    create: async( req,res)=> {
        let data = req.body
        if (!data.address) return res.status(400).send({ status: false, message: "Address is required" })
        let address = JSON.parse(data.address)

        data.address = address

        const { error } = usermodule.validate(data)
        if (error)
            return res.status(400).send({ status: false, message: error.message })

        const checkemailexist = await UserModel.findOne({ email: data.email })
        if (checkemailexist)
            return res.status(400).send({ status: false, message: "email already exist" })
        const checkphoneexist = await UserModel.findOne({ phone: data.phone })
        if (checkphoneexist)
            return res.status(400).send({ status: false, message: "phone no. already exist" })

        let files = req.files
        if (files.length > 0 && files[0].fieldname !== "profileImage")
            return res.status(400).send({ status: false, message: "profileimage is mandatery" })
        if (files && files.length > 0) {
            var photolink = await uploadFile(files[0])
        }
        if (files.length == 0)
            return res.status(400).send({ status: false, message: "File is mandatery" })

        const salt = await bcrypt.genSalt(10)
        const hashpass = await bcrypt.hash(data.password, salt)
        data.password = hashpass
        data.profileImage = photolink
        return data
    }
}