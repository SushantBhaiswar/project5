const { usermodule } = require("../DataValidation/schemavalidation");

module.exports = {
    uservalidatuion: async (req, res, next) => {
        const { error } = usermodule.validate(req.body)
        if (error) {
            return res.status(400).send({ status: false, message: error.message })
        } else next()
    }
}
