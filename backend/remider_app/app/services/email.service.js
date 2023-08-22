const nodemailer = require('nodemailer');
const emailConfig = require("../config/email.config");
const transporter = nodemailer.createTransport({
  service: emailConfig.SERVICE,
  auth: {
    user: emailConfig.USER,
    pass: emailConfig.PASSWORD
  }
});

async function generateMailOptions(emailTo, emailCC, emailBCC, subjectEmail, contentEmail, typeContent) {
  let mailOptions = {
    subject: subjectEmail,
    from: emailConfig.USER,
    to: emailTo,
    cc: emailCC,
    bcc: emailBCC,
  }

  if(typeContent){
    mailOptions[typeContent] = contentEmail
  }
  else {
    mailOptions.text = contentEmail
  }

  return mailOptions;
}

async function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Lỗi khi gửi email:', error);
      return {
        success: false,
        message: "Gửi email không thành công",
      }
    } else {
      console.log(`Email đã được gửi: To(${mailOptions.to})`, info.response);
      return {
        success: true,
        message: "Gửi email thành công",
      }
    }
  });
}

async function getEmailTemplateContent(emailTemplateName, replacements){
  const filePath = `${path.dirname(fs.realpathSync(`app/template/${emailTemplateName}`))}/${emailTemplateName}`;

  try {
    let html = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(item => {
      html = html.replace(`##${item.FieldName}##`, item.FieldValue);
    })
    return html;
  }
  catch (error) {
    console.error('Có lỗi khi thực hiện gửi mail:', error);
    response = { success: false, message: "Có lỗi xảy ra!" }
  }
}

async function getSloganMessageContent(){
  const filePath = `${path.dirname(fs.realpathSync('app/data/slogans.json'))}/slogans.json`;

  try {
    let slogansJson = fs.readFileSync(filePath);
    let slogans = JSON.parse(slogansJson);
    return slogans[Math.floor(Math.random()*slogans.length)];
  }
  catch (error) {
    console.error('Có lỗi khi thực hiện gửi mail:', error);
    return '';
  }
}

module.exports = {
  generateMailOptions,
  getEmailTemplateContent,
  getSloganMessageContent,
  sendEmail
}