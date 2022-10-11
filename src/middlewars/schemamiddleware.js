const { usermodule ,userupdate } = require("../DataValidation/schemavalidation");
module.exports = {
    uservalidatuion: async (req, res) => {
        const { error } = usermodule.validate(req.body)
        if (error) {
            return res.status(400).send({ status: false, message: error.message })
        } else next()
    },
    updatevalidation : async (req,res,next) =>{
        const{error} =userupdate.validate(req.body)
        if(error){
            return res.status(400).send({ status: false, message: error.message }) 
        }else next()
    }
}
