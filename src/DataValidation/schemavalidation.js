const joi = require('joi')
const UserModel = require('../Models/UserModel')

module.exports =
{
    usermodule: joi.object
        ({
            fname: joi.string().required(),
            lname: joi.string().required().trim(),
            email: joi.string().required().email().trim(),
            profileImage: joi.string(),
            phone: joi.string().required().min(10).message("Phone number should be greater than 10").max(10).message("Phone number should be less than 10"),
            password: joi.string().required().trim(),
            address: joi.object({
                shipping:
                {
                    street: joi.string().required().trim(),
                    city: joi.string().required().trim(),
                    pincode: joi.number().required()/*.min(6).message({ 'any.only': 'Pincode should be 6 digits' }).max(6).message({ 'any.only': "Pincode should be 6 digits" })*/
                },
                billing: {
                    street: joi.string().required().trim(),
                    city: joi.string().required().trim(),
                    pincode: joi.number().required()/*.min(6).message({ 'any.only': 'Pincode should be 6 digits' }).max(6).message({ 'any.only': "Pincode should be 6 digits" })*/
                }
            })
        })
}