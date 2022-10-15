const joi = require('joi')
const UserModel = require('./UserModel')

module.exports =
{
    usermodule: joi.object
        ({
            fname: joi.string().required().label('First Name'),
            lname: joi.string().required().trim().label('Last Name'),
            email: joi.string().required().email().trim(),
            profileImage: joi.string(),
            phone: joi.string().required().regex(/^((0091)|(\+91)|0?)[6789]{1}\d{9}$/),
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
        }),
    updatevalidation: joi.object({
        fname: joi.string().label('First Name'),
        lname: joi.string().trim().label('Last Name'),
        email: joi.string().email().trim(),
        profileImage: joi.string(),
        phone: joi.string().regex(/^((0091)|(\+91)|0?)[6789]{1}\d{9}$/),
        password: joi.string().trim(),
        address: joi.object({
            shipping: joi.object({
                street: joi.string().required().trim(),
                city: joi.string().required().trim(),
                pincode: joi.number().required()
            }),
            billing: joi.object({
                street: joi.string().required().trim(),
                city: joi.string().required().trim(),
                pincode: joi.number().required()
            })
        })
    }),
   

}