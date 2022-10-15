require('dotenv')

const nodemailer = require('nodemailer')
module.exports = {
    transpoter: nodemailer.createTransport({
        host: process.env.email_host,
        port: process.env.email_port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.email_user, // Admin Gmail ID
            pass: process.env.email_pass, // Admin Gmail Password
        },
    })
}
