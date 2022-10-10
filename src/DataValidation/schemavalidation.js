const joi = require('joi')

module.exports ={
   
    usermodule : joi.object({
        fname : joi.string().required().trim(),
        lname : joi.string().required().trim(),
        email : joi.string().required().email().trim(),
        profileImage : joi.string(),
        phone :joi.number().required().min(10). message({ 'any.only': 'Please enter a valid number' }).max(10).message({'any.only':"Please enter a valid number"}),
        password : joi.string().required().trim(),
        street :joi.string().required().trim(),
        city :joi.string().required().trim(),
        city :joi.number().required().min(6). message({ 'any.only': 'Pincode should be 6 digits' }).max(6).message({'any.only':"Pincode should be 6 digits"}),
    })
} 