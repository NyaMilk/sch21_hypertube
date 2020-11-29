const nodemailer = require('nodemailer');
const keys = require("../config/keys");
const userName = keys.EMAIL;
const password = keys.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userName,
    pass: password
  }
});

const sendMail = (to, subject, text, html = '') => {
    const mailOptions = {
        from: userName,
        to: to,
        subject: subject,
        text: text,
        html: html
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return false;
        } else {
          return true;
        }
      });
}

exports.sendMail = sendMail;