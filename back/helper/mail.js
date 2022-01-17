const nodemailer = require("nodemailer");

const sendMail = async (email, subject, mess) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD, // generated ethereal password
        },
    });

    return await transporter.sendMail({
        from: '"✔✔✔🤵👻" <a7med.emailsender@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: subject, // Subject line
        // text: "Hello world?", // plain text body
        html: `<b>${mess}?</b>`, // html body
    });
}

module.exports = { sendMail }