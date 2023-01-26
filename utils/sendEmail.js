const nodemailer = require('nodemailer');


const welcomeEmail = async (subject, message,send_to,sent_from,reply_to) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
    })

    const options = {
        from : sent_from,
        to : send_to,
        replyTo: reply_to,
        subject: subject,
        html: message
    }

    transporter.sendMail(options, function(err,info) {
        if (err) {
            console.log(err)
        }else{
            console.log(info)
        }

    })
}

module.exports = {
    welcomeEmail
}