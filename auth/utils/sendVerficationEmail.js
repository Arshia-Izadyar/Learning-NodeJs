const sendEmail = require('./sendEmail');


async function sendVerificationEmail({name,email,VerificationToken,origin}){

    const msg = `<p> confirm your email with clicking on link</p>`

    let value = `${origin}/api/v1/auth/verify-email?token=${VerificationToken}&email=${email}` 

    return sendEmail({
        to: email,
        subject:"account verification",
        html:`<h1> hello ${name} </h1>
        <p>${value}</p>
        <a href="${value}"> link </a>"
        ${msg}
        
        
        `
    })
}

module.exports = sendVerificationEmail;