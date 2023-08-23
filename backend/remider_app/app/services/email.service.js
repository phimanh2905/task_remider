const nodemailer = require('nodemailer');
const emailConfig = require("../config/email.config");
const commonFn = require("../common/commonFn.js");

const transporter = nodemailer.createTransport({
  service: emailConfig.SERVICE,
  auth: {
    user: emailConfig.USER,
    pass: emailConfig.PASSWORD
  }
});

async function generateMailOptions(emailTo, subjectEmail, contentEmail, typeContent) {
  let mailOptions = {
    subject: subjectEmail,
    from: emailConfig.USER,
    to: emailTo,
    cc: emailConfig.CC,
    bcc: emailConfig.BCC,
  }

  if (typeContent) {
    mailOptions[typeContent] = contentEmail
  }
  else {
    mailOptions.text = contentEmail
  }

  return mailOptions;
}

async function sendEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Lỗi khi gửi email:', error);
        resolve({
          success: false,
          message: "Gửi email không thành công",
        })
      } else {
        console.log(`Email đã được gửi: To(${mailOptions.to})`, info.response);
        resolve({
          success: true,
          message: "Gửi email thành công",
        })
      }
    })
  })
}

async function getEmailTemplateContent(emailTemplateName, replacements) {
  try {
    let html = commonFn.readFileWithPath(`app/template/${emailTemplateName}`);
    replacements.forEach(item => {
      html = html.replace(`##${item.FieldName}##`, item.FieldValue);
    })
    return html;
  }
  catch (error) {
    console.error('Có lỗi khi thực hiện gửi mail:', error);
  }
}

async function getSloganMessageContent() {
  try {
    let slogansJson = commonFn.readFileWithPath('app/data/slogans.json');;
    let slogans = JSON.parse(slogansJson);
    return slogans[Math.floor(Math.random() * slogans.length)];
  }
  catch (error) {
    console.error('Có lỗi khi thực hiện gửi mail:', error);
  }
}

module.exports = {
  generateMailOptions,
  getEmailTemplateContent,
  getSloganMessageContent,
  sendEmail
}