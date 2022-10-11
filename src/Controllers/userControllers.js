const aws = require("aws-sdk");
const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const { parse } = require("dotenv");
const { usermodule, userupdate } = require("../DataValidation/schemavalidation");
const createError = require('http-errors')

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: '2006-03-01' });
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
    })
}

module.exports = {
    //create user
    createuser: async function (req, res) {
        try {
            let data = req.body
            data.address = JSON.parse(data.address)
            const { error } = usermodule.validate(data)
            if (error) 
                return res.status(400).send({ status: false, message: error.message })
            
            // throw new Error(JSON.stringify(error.message))}
            const checkemailexist = await UserModel.findOne({ email: data.email })
            if (checkemailexist) 
            return res.status(400).send({ status: false, message: "email already exist" })
            // return createError(400, `${data.email} is already exist `)
            const checkphoneexist = await UserModel.findOne({ phone: data.phone })
            if (checkphoneexist) 
            return res.status(400).send({ status: false, message: "phone no. already exist" })
            
            let files = req.files
            if (files && files.length > 0) {
                var photolink = await uploadFile(files[0])
                console.log(photolink);
            }
            if (files.length == 0)
                return res.status(400).send({ status: false, message: "File is mandatery" })

            // createError(404, err, { expose: false })

            const salt = await bcrypt.genSalt(10)
            const hashpass = await bcrypt.hash(data.password, salt)
            data.password = hashpass
            data.profileImage = photolink

            let createuser = await UserModel.create(data)
            res.status(201).send({ "status": true, "message": "User created successfully", "data": createuser })
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: false, msg: error.message });
        }
    }

}
