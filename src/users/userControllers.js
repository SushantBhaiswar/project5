const UserModel = require("./UserModel");
const bcrypt = require("bcrypt");
const { usermodule, userupdate } = require("./schemavalidation");
const createError = require('http-errors');
const { uploadFile } = require("../connections/aws");
const md5 = require('md5')
const jwt = require('jsonwebtoken')
require('dotenv')

module.exports = {
    //create user
    createuser: async function (req, res) {
        try {
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

            let createuser = await UserModel.create(data)
            res.status(201).send({ "status": true, "message": "User created successfully", "data": createuser })
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: false, msg: error.message });
        }
    },
    loginuser: async function (req, res) {
        let { email, password } = req.body
        let user = await UserModel.findOne({ email: email });
        let compare = await bcrypt.compare(password, user.password)
        if (!compare) return res.status(400).send({ status: false, message: "Invalid credentials" })

        let token = jwt.sign({
            userId: user._id
        }, process.env.secret_key)
        res.status(200).send({ status: true, Message: "User login successfull", data: { userId: user._id, token: token } })

    },
    // update user
    updateUserByParam: async function (req, res) {
        try {
            let userId = req.params.userId;
            let id = await UserModel.findById(userId)
            if (!id) return res.status(404).send({ status: false, message: "user not found" })

            let { fname, lname, email, profileImage, phone, password, address } = req.body;

            if (Object.entries(req.body).length == 0) {
                return res.status(400).send({ status: false, message: "Enter Keys to update" })
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

