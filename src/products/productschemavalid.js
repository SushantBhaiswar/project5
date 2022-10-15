const Joi = require("joi");

module.exports = {

    productvalidation: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        currencyId: Joi.string().required().valid("INR", "inr"),
        currencyFormat: Joi.string().required().valid("₹"),
        isFreeShipping: Joi.boolean(),
        productImage: Joi.string().required(),
        style: Joi.string(),
        availableSizes: Joi.string().required(),
        installments: Joi.number().required(),
    }),
    getproductvalid: Joi.object({
        Productname: Joi.string(),
        Size: Joi.string(),
        priceGreaterThan: Joi.number(),
        priceLessThan: Joi.number(),
        priceSort: Joi.number().valid(-1, 1),
    }),
    updateproductvalid: Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        currencyId: Joi.string().valid("INR"),
        currencyFormat: Joi.string().valid("₹"),
        isFreeShipping: Joi.boolean(),
        productImage: Joi.string(),
        style: Joi.string(),
        availableSizes: Joi.string(),
        installments: Joi.number(),
    }),
   

}