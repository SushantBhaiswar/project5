const UserModel = require("./UserModel");
const bcrypt = require("bcrypt");
const { usermodule, updatevalidation } = require("./schemavalidation");
const { uploadFile } = require("../aws");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const { transpoter } = require("../config/emailconfig");
require('dotenv')
const ObjectId = mongoose.Types.ObjectId


module.exports = {
    //create user
    createuser: async function (req, res) {
        try {
            let data = req.body
            if (!data.address) return res.status(400).send({ status: false, message: "Address is required" })
            if (typeof (data.address) == "string") {
                let address = JSON.parse(data.address)
                data.address = address
            }
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
    //login user
    loginuser: async function (req, res) {
        try {
            let { email, password } = req.body
            let user = await UserModel.findOne({ email: email, isDeleted: false });
            if (!user) return res.status(404).send({ status: false, message: "User not found" })
            let compare = await bcrypt.compare(password, user.password)
         
            if (!compare) return res.status(400).send({ status: false, message: "Invalid credentials" })

            let token = jwt.sign({
                userId: user._id
            }, process.env.secret_key)
            return res.status(200).send({ status: true, Message: "User login successfull", data: { userId: user._id, token: token } })

        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })

        }
    },
    getuser: async function (req, res) {
        try {
            let { userId } = req.params
            if (!userId) return res.status(400).send({ status: false, message: "userId is required" })
            if (userId != req.decodedtoken.userId)
                return res.status(400).send({ status: false, message: "Wrong userId is provided" })
            if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "userId is Invalid" })
          
            let fetchdetails = await UserModel.findOne({ _id: userId, isDeleted: false })
            if (!fetchdetails) return res.status(404).send({ status: false, message: "Data not found" })

            return res.status(200).send({
                "status": true,
                "message": "User profile details",
                "data": fetchdetails
            })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    // update user
    updateUserByParam: async function (req, res) {
        try {
            if (Object.entries(req.body).length == 0)
                return res.status(400).send({ status: false, message: "Enter Keys to update" })

            let userId = req.params.userId;
            let data = await UserModel.findOne({ _id: userId, isDeleted: false }).lean()
            if (!data) return res.status(404).send({ status: false, message: "user not found" })

            let { password, address ,email,phone,fname,lname} = req.body;
            let value = req.body
            if (address) {
                value.address = JSON.parse(address)
            }
            if (email) {
                data.email = email;
            }
            if (phone) {
                if (!/^((0091)|(\+91)|0?)[6789]{1}\d{9}$/.test(phone)) return res.status(400).send({ status: false, message: "InValid phone number" })
                data.phone = phone;
            }
            if (fname) {
             
                data.fname = fname;
            }
            if (lname) {
               
                data.lname = lname;
            }
            const { error } = updatevalidation.validate(value)
            if (error)
                return res.status(400).send({ status: false, message: error.message })
            address = value.address
            if (address) {
                if (address.shipping) {
                    if (address.shipping.street) {
                        // if (typeof (address.shipping.street) !== "string") return res.status(400).send({ status: false, message: `${address.shipping.street} should be string` })
                        data.address.shipping.street = address.shipping.street
                    }
                    if (address.shipping.city) {
                        // if (typeof (address.shipping.city) !== "string") return res.status(400).send({ status: false, message: `${address.shipping.city} should be string` })
                        data.address.shipping.city = address.shipping.city
                    }
                    if (address.shipping.pincode) {
                        if (! /^[1-9][0-9]{5}$/.test(address.shipping.pincode)) return res.status(400).send({ status: false, message: `${address.shipping.pincode} Not valid pincode` })
                        data.address.shipping.pincode = address.shipping.pincode
                    }
                }
                if (address.billing) {
                    if (address.billing) {
                        if (address.billing.street) {
                            // if (typeof (address.billing.street) !== "string") return res.status(400).send({ status: false, message: `${address.billing.street} should be string` })
                            data.address.billing.street = address.billing.street
                        }
                        if (address.billing.city) {
                            // if (typeof (address.billing.city) !== "string") return res.status(400).send({ status: false, message: `${address.billing.city} should be string` })
                            data.address.billing.city = address.billing.city
                        }
                        if (address.billing.pincode) {
                            if (! /^[1-9][0-9]{5}$/.test(address.billing.pincode)) return res.status(400).send({ status: false, message: `${address.billing.pincode} Not valid pincode` })
                            data.address.billing.pincode = address.billing.pincode
                        }
                    }
                }
            }
            if (req.files) {
                let files = req.files
                console.log(files[0].fieldname)
                if (files.length > 0 && files[0].fieldname !== "profileImage")
                    return res.status(400).send({ status: false, message: `profileImage is mandatery` })
                if (files && files.length > 0) {
                    var photolink = await uploadFile(files[0])
                    console.log(photolink);
                    data.profileImage = photolink
                    console.log(data.profileImage);
                }
            }
            if (password) {
                let salt = await bcrypt.genSalt(10)
                let hashpassword = await bcrypt.hash(password, salt)
                console.log(hashpassword);

                data.password = hashpassword;
            }
              console.log(data)
            let update = await UserModel.findOneAndUpdate({ _id: userId }, data, { new: true })
            console.log(update)

            return res.status(200).send({ status: true, message: "Success", data: update });

        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },
    forgetpassword: async (req, res) => {

        const { email } = req.body
        if (!email)
            return res.status(400).send({ status: false, message: "Email is required" })

        const user = await UserModel.findOne({ email: email })
        if (!user)
            return res.status(404).send({ status: false, message: "User not found" })

        const secret = user._id + process.env.secret_key
        const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
        const link = `http://127.0.0.1:3001/ResetPassword/${user._id}/${token}`
        console.log(link)
        let info = await transpoter.sendMail({
            from: process.env.email_from,
            to: user.email,
            subject: "Product-managment password Reset Link",
            html: `<a href=${link}>Click Here</a> to Reset Your Password`
        })
        res.status(400).send({ status: true, message: "Email sent successfully", mail: info })
    },
    ResetPassword: async (req, res) => {
        const { password, confirmPassword } = req.body
        if (password !== confirmPassword)
            return res.send({ "status": false, message: "New Password and Confirm New Password doesn't match" })
        const { id, token } = req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.secret_key
        try {
            jwt.verify(token, new_secret, (err) => {
                if (err)
                    return res.status(400).send({ "status": false, message: err.message })
            })

            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
            res.send({ "status": true, message: "Password Reset Successfully" })

        }

        catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Invalid Token" })
        }

    }

}
