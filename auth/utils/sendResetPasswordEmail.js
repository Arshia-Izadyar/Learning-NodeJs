const sendEmail = require('./sendEmail');


async function sendResetPasswordEmail({name,email,passwordToken,origin}){

    const msg = `<p> reset password with clicking on link</p>`

    let value = `${origin}/api/v1/auth/reset-password?token=${passwordToken}&email=${email}` 

    return sendEmail({
        to: email,
        subject:"account recovery",
        html:`<h1> hello ${name} </h1>
        <p>${value}</p>
        <a href="${value}"> link </a>"
        ${msg}
        
        
        `
    })
}

module.exports = sendResetPasswordEmail;