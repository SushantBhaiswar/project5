const joi = require('joi')
const UserModel = require('../Models/UserModel')

module.exports =
{
    usermodule: joi.object
        ({
            fname: joi.string().required().label('First Name'),
            lname: joi.string().required().trim().label('Last Name'),
            email: joi.string().required().email().trim(),
            profileImage: joi.string(),
            phone: joi.string().required().min(10).message("Phone number should be greater than 10").max(10).message("Phone number should be less than 10"),
            password: joi.string().required().trim(),
            address: joi.object({
                shipping:
                {
                    street: joi.string().required().trim(),
                    city: joi.string().required().trim(),
                    pincode: joi.number().required()
                },
                billing: {
                    street: joi.string().required().trim(),
                    city: joi.string().required().trim(),
                    pincode: joi.number().required()
                }
            })
        })
}