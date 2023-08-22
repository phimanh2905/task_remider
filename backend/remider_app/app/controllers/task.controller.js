const fs = require('fs');
const path = require('path');

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

exports.sendMail = (req, res) => {
  const filePath = `${path.dirname(fs.realpathSync('app/data/employees.json'))}/employees.json`;
  let response = { success: false, message: "" };

  fs.readFile(filePath, 'utf8', async (error, data) => {
    if (error) {
      console.error('Lỗi khi đọc tệp JSON:', error);
      response = { success: false, message: "Có lỗi xảy ra!" };
      return;
    }

    try {
      let employees = JSON.parse(data);
      let employeesSendEmail = employees.filter(x => req.body.indexOf(x.FullName) == -1);

      for (let i = 0; i < employeesSendEmail.length; i++) {
        // Lấy nội dung HTML cần gửi
        let sloganMessageContent = await getSloganMessageContent();

        let replacements = [
          {
            FieldName: 'FullName',
            FieldValue: employeesSendEmail[i].FullName
          },
          {
            FieldName: 'DateNow',
            FieldValue: commonFn.getDateNow()
          },
          {
            FieldName: 'SloganMessage',
            FieldValue: sloganMessageContent.Content
          },
          {
            FieldName: 'Author',
            FieldValue: sloganMessageContent.Author ?? 'Khuất danh'
          }
        ]

        // Lấy nội dung HTML cần gửi
        let htmlContentEmail = await getEmailTemplateContent('email_reminder_task.html', replacements);

        // Subject email
        let subjectEmail = `[Lưu ý] Đề nghị thành viên ${employeesSendEmail[i].FullName} kiểm tra và cập nhật công việc ngày ${commonFn.getDateNow()}`;
        
        let mailOptions = await generateMailOptions(
          employeesSendEmail[i].Email,
          emailConfig.CC,
          emailConfig.BCC,
          subjectEmail,
          htmlContentEmail,
          'html'
        );
        response = await sendEmail(mailOptions);
      }
    }
    catch (error) {
      console.error('Có lỗi khi thực hiện gửi mail:', error);
      response = { success: false, message: "Có lỗi xảy ra!" }
    }
  });
  res.json(response);
};

// exports.sendMail = (req, res) => {
//   const { timeNow, rowHeader, rowBody } = req.body;
//   const filePath = '../data/employees.json';

//   console.log(rowHeader);
//   console.log(rowBody);

//   const response = { message: "sendMail success", error: "" };

//   const transferMasterData = (rowHeader, rowBody) => {
//     let masterData = [];
//     rowBody.forEach((body) => {
//       rowHeader.forEach((header) => {});
//     });
//     return masterData;
//   };

//   try {
//     const masterData = this.transferMasterData(rowHeader, rowBody);
//   } catch (error) {
//     response.error = error;
//   }
//   res.json(response);
// };