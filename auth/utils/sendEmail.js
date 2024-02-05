"use strict";
const nodemailer = require("nodemailer");
const mailerConfig = require('./nodemailerConfig')

async function sendEmail({to, subject, html}){
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport(mailerConfig);

    return transporter.sendMail({
        from: '"arshia" <foo@example.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        // text: "Hello world?", // plain text body
        html, // html body
      });
}


module.exports = sendEmail;