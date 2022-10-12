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

            let createuser = await UserModel.create(data)
            res.status(201).send({ "status": true, "message": "User created successfully", "data": createuser })
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: false, msg: error.message });
        }
    },
    // update user
    updateUserByParam: async function (req, res) {
        try {
            let userId = req.params.userId;
            let id = await UserModel.findById(userId)
            if (!id) return res.status(404).send({ status: false, message: "user not found" })
            //if (id.isDeleted == true) return res.status(404).send({ status: false, message: "book is already deleted, you can't update" })

            let { fname, lname, email, profileImage, phone, password, address } = req.body;

            if (Object.entries(req.body).length == 0) {
                return res.status(400).send({ status: false, message: "Please enter what you want to update" })
            }
            const data = {};
            if (email) {
                if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Please enter Valid Email" })
                let checkEmail = await UserModel.findOne({ email: email })
                if (checkEmail) return res.status(400).send({ status: false, message: "The Same email user is already present" })
                data.email = email;
            }
            if (phone) {
                if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: "Please enter Valid phone number" })
                let checkphone = await UserModel.findOne({ phone: phone });
                if (checkphone) return res.status(400).send({ status: false, message: "This phone number is already Present" })
                data.phone = phone;
            }
            if (fname) { data.fname = fname; }
            if (lname) { data.lname = lname; }

            if (address) {

                data.address = address;
            }
            if (profileImage) {

                data.profileImage = profileImage;
            }
            if (password) {

                data.password = password;
            }
            let update = await UserModel.findOneAndUpdate({ _id: userId }, data, { new: true })
            return res.status(200).send({ status: true, message: "Success", data: update });

        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}


