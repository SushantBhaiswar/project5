const aws = require("aws-sdk");
const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const { parse } = require("dotenv");

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
            let files =req.files
           
            if (files && files.length > 0) {
                var photolink = await uploadFile(files[0])
            }
            if (files.length == 0)
                return res.status(400).send({ status: false, message: "File is mandatery" })
            let data = req.body
            data.profileImage = photolink

            const salt = await bcrypt.genSalt(10)
            const hashpass = await bcrypt.hash(data.password, salt)

            data.password = hashpass
          
           data.address = JSON.parse(data.address)
          
           let createuser = await UserModel.create(data)
            res.status(201).send({
                "status": true,
                "message": "User created successfully",
                "data": createuser
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: false, msg: error.message });
        }
    }

    
}
